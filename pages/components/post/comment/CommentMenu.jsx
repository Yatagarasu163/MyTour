import { useEffect, useRef } from 'react';

export default function CommentMenu({ onEdit, onDelete, disabled, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, [onClose]);

  const menuStyle = {
    position: 'absolute',
    top: '2rem',
    right: '0.5rem',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    zIndex: 10,
  };

  const buttonStyle = {
    display: 'block',
    width: '100%',
    padding: '0.5rem 1rem',
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
  };

  return (
    <div ref={menuRef} role="menu" style={menuStyle}>
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        style={buttonStyle}
        role="menuitem"
      >
        Edit
      </button>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        disabled={disabled}
        role="menuitem"
        style={{ ...buttonStyle, color: '#d00' }}
      >
        Delete
      </button>
    </div>
  );
}