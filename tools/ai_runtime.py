"""tools/ai_runtime.py

A small runtime adapter that prefers local AI backends when available (llama-cpp-python, transformers)
and falls back to remote APIs (OpenAI) if nothing local is available.

Usage:
    from tools.ai_runtime import generate_text
    text = generate_text("Hello world", max_tokens=200)

Environment variables:
    LOCAL_AI=1              # prefer local backends
    LOCAL_AI_BACKEND        # "llama" or "transformers" (auto-detected if not set)
    LOCAL_AI_MODEL_PATH     # path to local model file or HF model id
    OPENAI_API_KEY          # used if no local backend available

This file is intentionally lightweight and gives clear error messages for missing deps.
"""

from typing import Optional
import os


def _try_llama(prompt: str, max_tokens: int, model_path: Optional[str]):
    try:
        from llama_cpp import Llama
    except Exception as e:
        raise RuntimeError("llama-cpp-python not available: pip install llama-cpp-python") from e

    if model_path is None:
        raise RuntimeError("LOCAL_AI selected llama backend but LOCAL_AI_MODEL_PATH is not set")

    llama = Llama(model_path=model_path)
    response = llama(prompt, max_tokens=max_tokens)
    # llama-cpp returns as dict with 'choices'
    if isinstance(response, dict) and response.get("choices"):
        return response["choices"][0].get("text", "")
    # fallback
    return str(response)


def _try_transformers(prompt: str, max_tokens: int, model: Optional[str]):
    try:
        from transformers import pipeline
    except Exception as e:
        raise RuntimeError("transformers not available: pip install 'transformers[sentencepiece]' and a backend like torch or flax") from e

    if model is None:
        raise RuntimeError("LOCAL_AI selected transformers backend but LOCAL_AI_MODEL_PATH (model id) is not set")

    # Use text-generation pipeline. Use device_map if available; keep CPU-friendly default.
    gen = pipeline("text-generation", model=model, trust_remote_code=True)
    out = gen(prompt, max_new_tokens=max_tokens, do_sample=False)
    if isinstance(out, list) and len(out) > 0:
        return out[0].get("generated_text", out[0].get("text", ""))
    return str(out)


def _try_openai(prompt: str, max_tokens: int):
    try:
        import openai
    except Exception as e:
        raise RuntimeError("openai package not installed: pip install openai") from e

    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set; cannot use remote OpenAI API")

    openai.api_key = api_key
    resp = openai.Completion.create(engine=os.environ.get("OPENAI_ENGINE", "text-davinci-003"), prompt=prompt, max_tokens=max_tokens)
    if resp and getattr(resp, "choices", None):
        return resp.choices[0].text
    return str(resp)


def generate_text(prompt: str, max_tokens: int = 512, prefer_local: Optional[bool] = None) -> str:
    """Generate text using the best available backend.

    Preference order:
      1. If prefer_local or env LOCAL_AI=1: try local backends in order (llama, transformers)
      2. Else try remote OpenAI (if configured)
      3. Finally try local backends as a fallback

    Raises helpful RuntimeError messages if no backend is available.
    """
    prefer_local_env = os.environ.get("LOCAL_AI", None)
    if prefer_local is None:
        prefer_local = prefer_local_env == "1" or prefer_local_env == "true"

    backend_hint = (os.environ.get("LOCAL_AI_BACKEND") or "auto").lower()
    model_path = os.environ.get("LOCAL_AI_MODEL_PATH")

    errors = []

    if prefer_local:
        # local-first
        if backend_hint in ("auto", "llama"):
            try:
                return _try_llama(prompt, max_tokens, model_path)
            except Exception as e:
                errors.append(str(e))
        if backend_hint in ("auto", "transformers"):
            try:
                return _try_transformers(prompt, max_tokens, model_path)
            except Exception as e:
                errors.append(str(e))

        # fall back to OpenAI
        try:
            return _try_openai(prompt, max_tokens)
        except Exception as e:
            errors.append(str(e))

    else:
        # remote-first
        try:
            return _try_openai(prompt, max_tokens)
        except Exception as e:
            errors.append(str(e))

        # fall back to local
        if backend_hint in ("auto", "llama"):
            try:
                return _try_llama(prompt, max_tokens, model_path)
            except Exception as e:
                errors.append(str(e))
        if backend_hint in ("auto", "transformers"):
            try:
                return _try_transformers(prompt, max_tokens, model_path)
            except Exception as e:
                errors.append(str(e))

    # If we get here, nothing worked
    raise RuntimeError("No AI backend available. Tried: \n" + "\n".join(errors))
