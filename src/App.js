import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentColor, setCurrentColor] = useState('#3498db');
  const [colorHistory, setColorHistory] = useState(['#3498db']);
  const [copyMessage, setCopyMessage] = useState('');

  // Генерация случайного цвета
  const generateColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, '0')
      .toUpperCase();
    setCurrentColor(randomColor);
    addToHistory(randomColor);
  };

  // Добавление цвета в историю (максимум 5)
  const addToHistory = (color) => {
    setColorHistory((prev) => {
      const updated = [color, ...prev];
      return updated.slice(0, 5);
    });
  };

  // Копирование цвета в буфер обмена
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentColor).then(() => {
      setCopyMessage('✓ Скопировано!');
      setTimeout(() => setCopyMessage(''), 2000);
    });
  };

  // Поддержка клавиши Space для генерации цвета
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        generateColor();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Сохранение истории в Local Storage
  useEffect(() => {
    localStorage.setItem('colorHistory', JSON.stringify(colorHistory));
  }, [colorHistory]);

  return (
    <div className="app" style={{ backgroundColor: currentColor }}>
      <div className="container">
        <header className="header">
          <h1>🎨 Color Generator</h1>
          <p>Генератор случайных цветов</p>
        </header>

        <main className="main">
          {/* Отображение текущего цвета */}
          <div className="color-display">
            <div className="color-box" style={{ backgroundColor: currentColor }}></div>
            <div className="color-info">
              <h2>{currentColor}</h2>
              <p>RGB: {hexToRgb(currentColor)}</p>
            </div>
          </div>

          {/* Кнопки управления */}
          <div className="button-group">
            <button className="btn btn-primary" onClick={generateColor}>
              Сгенерировать цвет
            </button>
            <button className="btn btn-secondary" onClick={copyToClipboard}>
              📋 Копировать
            </button>
          </div>

          {/* Сообщение о копировании */}
          {copyMessage && <div className="copy-message">{copyMessage}</div>}

          {/* История цветов */}
          {colorHistory.length > 0 && (
            <div className="history">
              <h3>История последних цветов:</h3>
              <div className="history-grid">
                {colorHistory.map((color, index) => (
                  <div
                    key={index}
                    className="history-item"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setCurrentColor(color);
                      copyToClipboard();
                    }}
                    title={`Клик для выбора: ${color}`}
                  >
                    <span className="history-code">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Инструкции */}
          <div className="info-box">
            <h4>💡 Горячие клавиши:</h4>
            <ul>
              <li><strong>Space</strong> — сгенерировать новый цвет</li>
              <li><strong>Клик на цвет в истории</strong> — выбрать цвет</li>
            </ul>
          </div>
        </main>

        <footer className="footer">
          <p>Color Generator © 2025 | React Coursework</p>
        </footer>
      </div>
    </div>
  );
}

// Вспомогательная функция: конвертирование HEX в RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 'N/A';
}

export default App;