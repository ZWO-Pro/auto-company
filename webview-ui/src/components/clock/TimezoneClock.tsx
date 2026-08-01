import React, { useState, useEffect } from 'react';
import '../../styles/timezone-clock.css';

interface TimeZoneClock {
  label: string;
  timezone: string;
  offset: number;
}

export const TimezoneClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [timezones, setTimezones] = useState<TimeZoneClock[]>([
    { label: 'UTC', timezone: 'UTC', offset: 0 },
    { label: 'EST', timezone: 'America/New_York', offset: -5 },
    { label: 'PST', timezone: 'America/Los_Angeles', offset: -8 },
    { label: 'GMT', timezone: 'Europe/London', offset: 0 },
    { label: 'CET', timezone: 'Europe/Paris', offset: 1 },
    { label: 'IST', timezone: 'Asia/Kolkata', offset: 5.5 },
    { label: 'JST', timezone: 'Asia/Tokyo', offset: 9 },
    { label: 'AEST', timezone: 'Australia/Sydney', offset: 10 },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeInTimezone = (timezone: string): string => {
    try {
      const time = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }));
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return '--:--:--';
    }
  };

  const getDateInTimezone = (timezone: string): string => {
    try {
      const time = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }));
      return time.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="timezone-clock-container">
      <div className="clock-header">
        <h2>⏰ Global Time Synchronization</h2>
        <p className="clock-subtitle">Multi-timezone agent coordination</p>
      </div>

      <div className="timezone-grid">
        {timezones.map((tz, idx) => {
          const time = getTimeInTimezone(tz.timezone);
          const date = getDateInTimezone(tz.timezone);
          const hours = parseInt(time.split(':')[0]);
          const isDayTime = hours >= 6 && hours < 18;

          return (
            <div key={idx} className={`timezone-card ${isDayTime ? 'day' : 'night'}`}>
              <div className="timezone-header">
                <span className="timezone-label">{tz.label}</span>
                <span className={`timezone-indicator ${isDayTime ? 'day' : 'night'}`}>
                  {isDayTime ? '☀️' : '🌙'}
                </span>
              </div>

              <div className="time-display">
                <div className="time-large">{time}</div>
                <div className="time-date">{date}</div>
              </div>

              <div className="timezone-meta">
                <span className="timezone-offset">UTC{tz.offset > 0 ? '+' : ''}{tz.offset}</span>
              </div>

              <div className="clock-face">
                <AnalogClock timezone={tz.timezone} currentTime={currentTime} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="clock-footer">
        <p>Last updated: {currentTime.toLocaleTimeString('en-US', { hour12: false })}</p>
      </div>
    </div>
  );
};

interface AnalogClockProps {
  timezone: string;
  currentTime: Date;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ timezone, currentTime }) => {
  const getTime = (): [number, number, number] => {
    try {
      const time = new Date(currentTime.toLocaleString('en-US', { timeZone: timezone }));
      return [
        time.getHours() % 12,
        time.getMinutes(),
        time.getSeconds(),
      ];
    } catch {
      return [0, 0, 0];
    }
  };

  const [hours, minutes, seconds] = getTime();
  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;

  return (
    <svg viewBox="0 0 100 100" className="analog-clock">
      {/* Clock face */}
      <circle cx="50" cy="50" r="48" className="clock-circle" />

      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = 50 + 42 * Math.cos(angle);
        const y1 = 50 + 42 * Math.sin(angle);
        const x2 = 50 + 45 * Math.cos(angle);
        const y2 = 50 + 45 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="hour-marker" />;
      });

      {/* Hour hand */}
      <line
        x1="50"
        y1="50"
        x2={50 + 20 * Math.cos((hourDegrees - 90) * (Math.PI / 180))}
        y2={50 + 20 * Math.sin((hourDegrees - 90) * (Math.PI / 180))}
        className="hand hour-hand"
      />

      {/* Minute hand */}
      <line
        x1="50"
        y1="50"
        x2={50 + 30 * Math.cos((minuteDegrees - 90) * (Math.PI / 180))}
        y2={50 + 30 * Math.sin((minuteDegrees - 90) * (Math.PI / 180))}
        className="hand minute-hand"
      />

      {/* Second hand */}
      <line
        x1="50"
        y1="50"
        x2={50 + 32 * Math.cos((secondDegrees - 90) * (Math.PI / 180))}
        y2={50 + 32 * Math.sin((secondDegrees - 90) * (Math.PI / 180))}
        className="hand second-hand"
      />

      {/* Center dot */}
      <circle cx="50" cy="50" r="3" className="center-dot" />
    </svg>
  );
};

export default TimezoneClock;