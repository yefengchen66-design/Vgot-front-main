import React, { useEffect, useMemo, useRef, useState } from 'react';
import './SystemSelect.css';

/**
 * SystemSelect - a lightweight, accessible dropdown with system-like dark theme.
 * Props:
 * - value: string | number
 * - onChange: (newValue) => void
 * - options: Array<{ value: string|number, label: string, disabled?: boolean }>
 * - placeholder?: string
 * - disabled?: boolean
 * - className?: string (extra classes applied to trigger button)
 */
export default function SystemSelect({ value, onChange, options, placeholder, disabled, className = '' }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);
  const activeIndexRef = useRef(-1);

  const currentLabel = useMemo(() => {
    const found = (options || []).find(o => String(o.value) === String(value));
    return found ? found.label : (placeholder || 'Select');
  }, [options, value, placeholder]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;
      const b = btnRef.current;
      const m = menuRef.current;
      if (b && b.contains(e.target)) return;
      if (m && m.contains(e.target)) return;
      setOpen(false);
    }
    function handleEsc(e) {
      if (!open) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        btnRef.current && btnRef.current.focus();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    // reset active index when open
    const idx = (options || []).findIndex(o => String(o.value) === String(value));
    activeIndexRef.current = idx >= 0 ? idx : -1;
  }, [open, options, value]);

  const onKeyDownButton = (e) => {
    if (disabled) return;
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpen(true);
      setTimeout(() => {
        const m = menuRef.current;
        if (!m) return;
        const focusable = [...m.querySelectorAll('[data-index]')];
        if (focusable.length > 0) {
          const start = Math.max(0, activeIndexRef.current);
          const el = focusable[start] || focusable[0];
          el.focus();
        }
      }, 0);
    }
  };

  const onKeyDownOption = (e, idx, opt) => {
    if (opt.disabled) return;
    const total = options.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      let i = idx + 1;
      while (i < total && options[i].disabled) i++;
      if (i >= total) i = idx; // stay
      focusIndex(i);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      let i = idx - 1;
      while (i >= 0 && options[i].disabled) i--;
      if (i < 0) i = idx; // stay
      focusIndex(i);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(opt);
    }
  };

  const focusIndex = (i) => {
    const m = menuRef.current;
    if (!m) return;
    const el = m.querySelector(`[data-index="${i}"]`);
    if (el) {
      activeIndexRef.current = i;
      el.focus();
    }
  };

  const choose = (opt) => {
    if (opt.disabled) return;
    onChange && onChange(opt.value);
    setOpen(false);
    btnRef.current && btnRef.current.focus();
  };

  return (
    <div className="system-select">
      <button
        type="button"
        ref={btnRef}
        className={`system-select__button ${className || ''}`}
        onClick={() => !disabled && setOpen(v => !v)}
        onKeyDown={onKeyDownButton}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled ? 'true' : 'false'}
      >
        <span>{currentLabel}</span>
        <i className="system-select__chevron" aria-hidden="true" />
      </button>
      {open && (
        <div ref={menuRef} className="system-select__menu" role="listbox" aria-activedescendant={String(value)}>
          {(options || []).map((opt, idx) => (
            <div
              key={String(opt.value)}
              id={String(opt.value)}
              role="option"
              aria-selected={String(opt.value) === String(value) ? 'true' : 'false'}
              aria-disabled={opt.disabled ? 'true' : 'false'}
              tabIndex={opt.disabled ? -1 : 0}
              data-index={idx}
              className="system-select__option"
              onClick={() => choose(opt)}
              onKeyDown={(e) => onKeyDownOption(e, idx, opt)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
