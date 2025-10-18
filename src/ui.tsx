import * as React from 'react';
import * as ReactDom from 'react-dom';
import { CssStyle } from './buildCssString';
import { UnitType } from './buildSizeStringByUnit';
import { messageTypes } from './messagesTypes';
import styles from './ui.css';
import './styling.css';
import Spacer from './ui/Spacer';
import UserComponentSettingList from './ui/UserComponentSettingList';
import { UserComponentSetting } from './userComponentSetting';
import CodeBlock from './CodeBlock';
import { BuildCodes } from './buildCodes';
import UIApp from './UIApp';


const cssStyles: { value: CssStyle; label: string }[] = [
  { value: 'css', label: 'CSS' },
  { value: 'styled-components', label: 'styled-components' }
]

const unitTypes: { value: UnitType; label: string }[] = [
  { value: 'px', label: 'px' },
  { value: 'rem', label: 'rem' },
  { value: 'remAs10px', label: 'rem(as 10px)' }
]

const App: React.VFC = () => {
  // const [code, setCode] = React.useState('')
  const [selectedCssStyle, setCssStyle] = React.useState<CssStyle>('css')
  const [selectedUnitType, setUnitType] = React.useState<UnitType>('px')
  const [userComponentSettings, setUserComponentSettings] = React.useState<UserComponentSetting[]>([])
  const textRef = React.useRef<HTMLTextAreaElement>(null)
  const [codes, setCodes] = React.useState<BuildCodes>([]);

  const copyToClipboard = () => {
    if (textRef.current) {
      textRef.current.select()
      document.execCommand('copy')

      const msg: messageTypes = { type: 'notify-copy-success' }
      parent.postMessage(msg, '*')
    }
  }

  const notifyChangeCssStyle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const msg: messageTypes = { type: 'new-css-style-set', cssStyle: event.target.value as CssStyle, cssPrefix: '' }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const notifyChangeUnitType = (event: React.ChangeEvent<HTMLInputElement>) => {
    const msg: messageTypes = { type: 'new-unit-type-set', unitType: event.target.value as UnitType }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const notifyUpdateComponentSettings = (userComponentSettings: UserComponentSetting[]) => {
    const msg: messageTypes = { type: 'update-user-component-settings', userComponentSettings: userComponentSettings }
    parent.postMessage({ pluginMessage: msg }, '*')
  }

  const onAddUserComponentSetting = (userComponentSetting: UserComponentSetting) => {
    notifyUpdateComponentSettings([...userComponentSettings, userComponentSetting])
  }

  const onUpdateUserComponentSetting = (userComponentSetting: UserComponentSetting, index: number) => {
    const newUserComponentSettings = [...userComponentSettings]
    newUserComponentSettings[index] = userComponentSetting
    notifyUpdateComponentSettings(newUserComponentSettings)
  }

  const onDeleteUserComponentSetting = (name: string) => {
    notifyUpdateComponentSettings(userComponentSettings.filter((setting) => setting.name !== name))
  }

  // const syntaxHighlightedCode = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(code)), [code])

  // set initial values taken from figma storage
  React.useEffect(() => {
    onmessage = (event) => {
      const { cssStyle, unitType, generatedCodeStr, cssString } = event.data.pluginMessage;
      setCssStyle(cssStyle);setUnitType(unitType);
      setCodes([{type: 'css', code: cssString}, {type: 'jsx', code: generatedCodeStr}]);
      // setCode(`${generatedCodeStr}\n\n<style>\n${cssString}\n</style>`);
      setUserComponentSettings(event.data.pluginMessage.userComponentSettings)
    }
  }, [])

  return (
    <div>
      <div className={styles.code}>
        {/* <textarea className={styles.textareaForClipboard} ref={textRef} value={code} readOnly /> */}
        {/* <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedCode }} /> */}
        {codes.map((c, i) => <CodeBlock key={i} type={c.type} code={c.code} />)}
        {/* <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedCode }} /> */}

        <Spacer axis="vertical" size={12} />

        <div className={styles.buttonLayout}>
          <button className={styles.copyButton} onClick={copyToClipboard}>
            Copy to clipboard
          </button>
        </div>
      </div>

      <div className={styles.settings}>
        <h2 className={styles.heading}>Settings</h2>

        <Spacer axis="vertical" size={12} />

        <div className={styles.optionList}>
          {cssStyles.map((style) => (
            <div key={style.value} className={styles.option}>
              <input type="radio" name="css-style" id={style.value} value={style.value} checked={selectedCssStyle === style.value} onChange={notifyChangeCssStyle} />
              <label htmlFor={style.value}>{style.label}</label>
            </div>
          ))}
        </div>

        <Spacer axis="vertical" size={12} />

        <div className={styles.optionList}>
          {unitTypes.map((unitType) => (
            <div key={unitType.value} className={styles.option}>
              <input type="radio" name="unit-type" id={unitType.value} value={unitType.value} checked={selectedUnitType === unitType.value} onChange={notifyChangeUnitType} />
              <label htmlFor={unitType.value}>{unitType.label}</label>
            </div>
          ))}
        </div>

        <Spacer axis="vertical" size={12} />

        <UserComponentSettingList
          settings={userComponentSettings}
          onAdd={onAddUserComponentSetting}
          onDelete={onDeleteUserComponentSetting}
          onUpdate={onUpdateUserComponentSetting}
        />
      </div>
    </div>
  )
}

ReactDom.render(<UIApp />, document.getElementById('app'))
