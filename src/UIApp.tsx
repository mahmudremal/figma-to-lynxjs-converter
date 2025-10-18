import * as React from 'react';
import { Copy, Settings, ChevronDown } from 'lucide-react';
import styles from './UIApp.css';
import { messageTypes } from './messagesTypes';
import { CssStyle } from './buildCssString';
import { UnitType } from './buildSizeStringByUnit';
import { UserComponentSetting } from './userComponentSetting';
import { CodeStyle } from './buildCode';

const codeFormats = [
  { value: 'html', label: 'HTML' },
  { value: 'jsx', label: 'JSX' },
  { value: 'tsx', label: 'TSX' },
  { value: 'lynxjs', label: 'LynxJS' },
  { value: 'json', label: 'JSON' }
];

const cssStyles = [
  { value: 'css', label: 'CSS' },
  { value: 'styled-components', label: 'Styled-Component' },
  { value: 'tailwindcss', label: 'Tailwind CSS' },
  { value: 'daisyui', label: 'Daisy UI' }
];

const unitTypes = [
  { value: 'px', label: 'px' },
  { value: 'rem', label: 'rem' },
  { value: 'remAs10px', label: 'rem (as 10px)' }
];

const UIApp = () => {
  const [selectedFormat, setSelectedFormat] = React.useState<CodeStyle>('jsx');
  const [selectedCssStyle, setSelectedCssStyle] = React.useState<CssStyle>('css');
  const [selectedUnitType, setSelectedUnitType] = React.useState<UnitType>('px');
  const [classPrefix, setClassPrefix] = React.useState('');
  const [codes, setCodes] = React.useState([
    { type: 'jsx', code: 'export default function Button() {\n  return <button>Click me</button>;\n}' }
  ]);
  const textRef = React.useRef(null);

  const copyToClipboard = () => {
    if (textRef.current) {
      textRef.current.select();
      document.execCommand('copy');
      alert('Copied to clipboard!');
    }
  };

  const notifyChangeCssStyle = (newStyle: string) => {
    setSelectedCssStyle(newStyle as CssStyle);
    const msg: messageTypes = { type: 'new-css-style-set', cssStyle: newStyle as CssStyle, cssPrefix: classPrefix }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const notifyChangeUnitType = (newUnitType: string) => {
    setSelectedUnitType(newUnitType as UnitType);
    const msg: messageTypes = { type: 'new-unit-type-set', unitType: newUnitType as UnitType }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  // const notifyUpdateComponentSettings = (userComponentSettings: UserComponentSetting[]) => {
  //   const msg: messageTypes = { type: 'update-user-component-settings', userComponentSettings: userComponentSettings }
  //   parent.postMessage({ pluginMessage: msg }, '*')
  // }

  // const onAddUserComponentSetting = (userComponentSetting: UserComponentSetting) => {
  //   notifyUpdateComponentSettings([...userComponentSettings, userComponentSetting])
  // }

  // const onUpdateUserComponentSetting = (userComponentSetting: UserComponentSetting, index: number) => {
  //   const newUserComponentSettings = [...userComponentSettings]
  //   newUserComponentSettings[index] = userComponentSetting
  //   notifyUpdateComponentSettings(newUserComponentSettings)
  // }

  // const onDeleteUserComponentSetting = (name: string) => {
  //   notifyUpdateComponentSettings(userComponentSettings.filter((setting) => setting.name !== name))
  // }

  // const syntaxHighlightedCode = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(code)), [code])

  // set initial values taken from figma storage
  React.useEffect(() => {
    onmessage = (event) => {
      const { cssStyle, unitType, generatedCodeStr, cssString } = event.data.pluginMessage;
      setSelectedCssStyle(cssStyle as CssStyle);
      setSelectedUnitType(unitType as UnitType);
      setCodes([{type: 'css', code: cssString}, {type: 'jsx', code: generatedCodeStr}]);
      // setUserComponentSettings(event.data.pluginMessage.userComponentSettings)
    }
  }, [])
  const showPrefixInput = ['tailwindcss', 'daisyui'].includes(selectedCssStyle);
  

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <Settings size={20} />
          </div>
          <h1 className={styles.headerTitle}>Design Generator</h1>
        </div>

        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div>
              <label className={styles.label}>Output Format</label>
              <div className={styles.formatGrid}>
                {codeFormats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value as CodeStyle)}
                    className={`${styles.formatButton} ${selectedFormat === format.value ? styles.formatButtonActive : styles.formatButtonInactive}`}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.divider}>
              <label className={styles.label}>Styling Method</label>
              <div className={styles.styleGrid}>
                {cssStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => notifyChangeCssStyle(style.value)}
                    className={`${styles.styleButton} ${selectedCssStyle === style.value ? styles.styleButtonActive : styles.styleButtonInactive}`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            {showPrefixInput && (
              <div className={styles.prefixContainer}>
                <label htmlFor="prefix" className={styles.label}>Class Prefix</label>
                <input
                  id="prefix"
                  type="text"
                  value={classPrefix}
                  onChange={(e) => setClassPrefix(e.target.value)}
                  placeholder="e.g., app-"
                  className={styles.prefixInput}
                />
              </div>
            )}

            <div className={styles.divider}>
              <label htmlFor="unit-select" className={styles.label}>Unit Type</label>
              <div className={styles.selectWrapper}>
                <select
                  id="unit-select"
                  value={selectedUnitType}
                  onChange={(e) => notifyChangeUnitType(e.target.value)}
                  className={styles.select}
                >
                  {unitTypes.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className={styles.selectIcon} />
              </div>
            </div>
          </div>
        </div>

        {codes.map(({ code, type}, i) => (
          <div key={i} className={styles.card}>
            <label className={styles.label}>Generated Code</label>
            <textarea
              readOnly
              ref={textRef}
              value={code || ''}
              className={styles.textarea}
            />
            <button onClick={copyToClipboard} className={styles.copyButton}>
              <Copy size={18} />
              Copy to Clipboard
            </button>
          </div>
        ))}

        <div className={styles.footer}>
          <p className={styles.footerText}>Configure your design generation settings above</p>
        </div>
      </div>
    </div>
  );
};

export default UIApp;