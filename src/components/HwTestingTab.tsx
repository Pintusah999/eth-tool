import React, { useState } from 'react';
import { Cpu, HelpCircle, HardDrive, Zap, Sliders, Play, Settings } from 'lucide-react';

export default function HwTestingTab() {
  const [selectedReadCommand, setSelectedReadCommand] = useState('FW Version');
  const [hwLogs, setHwLogs] = useState<string[]>([
    '> Initializing Hardware Diagnostics...',
    '-- System Scan Start at 23:26:35',
    '> Detecting available channels...',
    'CH1: OK | CH2: OK | CH3: OK | CH4: OK | CH5: OK',
    '> Ready for instruction.'
  ]);
  
  // Channels and sliders configuration state
  const [channels, setChannels] = useState([
    { id: 1, name: 'CH 1', value: 32, enabled: true },
    { id: 2, name: 'CH 2', value: 0, enabled: false },
    { id: 3, name: 'CH 3', value: 64, enabled: true },
    { id: 4, name: 'CH 4', value: 0, enabled: false },
    { id: 5, name: 'CH 5', value: 16, enabled: true }
  ]);

  const [channelEnable, setChannelEnable] = useState(true);
  const [passthruEnable, setPassthruEnable] = useState(false);

  // Command reader trigger
  const handleReadClick = () => {
    let result = '';
    const now = new Date().toLocaleTimeString();
    
    switch (selectedReadCommand) {
      case 'FW Version':
        result = `[READ ${now}] Target MCU FW v2.4.0-STABLE. Rev: 2.12`;
        break;
      case 'Current PWM Value':
        result = `[READ ${now}] PWM registers: CH1=${calcHex(channels[0].value)}, CH2=${calcHex(channels[1].value)}, CH3=${calcHex(channels[2].value)}, CH5=${calcHex(channels[4].value)}`;
        break;
      case 'Offset Read':
        result = `[READ ${now}] DAC offsets: 0.12V, -0.01V, 0.44V, 0.11V, 0.00V`;
        break;
      case 'Passthru Status':
        result = `[READ ${now}] Passthru state: ${passthruEnable ? 'GATE OPEN' : 'GATE COMPLIANT / CLOSED'}`;
        break;
      case 'IP Address Read':
        result = `[READ ${now}] Target Static IP address bind: 192.168.1.105`;
        break;
      case 'MAC Address Read':
        result = `[READ ${now}] Network MAC interface: 00:1B:44:11:3A:B7`;
        break;
      case 'Channel Status Read':
        result = `[READ ${now}] Channel Interrogation: CH1=OK, CH2=DISABLED, CH3=OK, CH4=DISABLED, CH5=OK`;
        break;
    }
    setHwLogs(prev => [...prev, result]);
  };

  const calcHex = (val: number) => {
    const hex = Math.round((val / 100) * 255).toString(16).toUpperCase();
    return `0x${hex.padStart(2, '0')}`;
  };

  const handleSliderChange = (id: number, val: number) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, value: val } : ch));
  };

  const handleChannelCheckboxChange = (id: number, checked: boolean) => {
    setChannels(prev => prev.map(ch => ch.id === id ? { ...ch, enabled: checked } : ch));
  };

  const submitPwmSettings = () => {
    const now = new Date().toLocaleTimeString();
    setHwLogs(prev => [
      ...prev,
      `[PWM_SET ${now}] Sockets aligned. Wrote registers: ${channels.map(c => c.name + '=' + calcHex(c.value)).join(', ')}`
    ]);
    alert("PWM duty cycles written successfully to hardware memory chip.");
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 font-sans overflow-auto">
      
      {/* Top Section */}
      <div className="flex flex-col xl:flex-row gap-4">
        
        {/* READ COMMAND OPTION PANEL */}
        <section className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-4">
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="w-1.5 h-4 bg-zinc-950 dark:bg-zinc-100" />
              <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
                INTERROGATE READ COMMAND
              </h2>
            </div>

            {/* Simulated interactive Radios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
              {[
                'FW Version',
                'Current PWM Value',
                'Offset Read',
                'Passthru Status',
                'IP Address Read',
                'MAC Address Read',
                'Channel Status Read'
              ].map((cmd) => (
                <label 
                  key={cmd}
                  className={`flex items-center gap-3 px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/85 dark:border-zinc-805 rounded-md cursor-pointer transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    selectedReadCommand === cmd ? 'bg-zinc-150 border-zinc-950 dark:border-zinc-50' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="read-cmd"
                    className="border-zinc-300 text-zinc-950 focus:ring-zinc-900 focus:ring-0 w-3.5 h-3.5"
                    checked={selectedReadCommand === cmd}
                    onChange={() => setSelectedReadCommand(cmd)}
                  />
                  <span>{cmd}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleReadClick}
              className="w-full h-10 mt-3 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs font-bold tracking-widest uppercase rounded flex items-center justify-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] active:scale-95 transition-all"
            >
              <Zap className="w-4.5 h-4.5" />
              <span>EXECUTE READ REGISTER</span>
            </button>
          </div>

          {/* LOGGER HARDWARE DISPLAY (Middle panel) */}
          <div className="w-full md:w-80 shrink-0 bg-zinc-950 text-emerald-400 p-4 font-mono text-[11px] rounded border border-zinc-90 w-full min-h-[220px] max-h-[300px] overflow-y-auto text-left flex flex-col justify-between">
            <div className="space-y-1">
              {hwLogs.map((log, idx) => (
                <div key={idx} className={log.startsWith('[') ? 'text-zinc-50' : ''}>{log}</div>
              ))}
            </div>
            <div className="pt-2 border-t border-emerald-950/40 text-emerald-600 font-bold text-[10px] uppercase tracking-widest flex items-center justify-between">
              <span>HARDWARE CONSOLE BIND</span>
              <span className="animate-pulse">● READY</span>
            </div>
          </div>

        </section>

        {/* DEVICE DETAILS COLUMN WITH MOTHERBOARD SVG SCHEMATIC */}
        <aside className="w-full xl:w-80 shrink-0 flex flex-col gap-4">
          
          <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/25 border-b border-zinc-100 dark:border-zinc-850 flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase">
                  BOARD STATUS SCHEMATIC
                </h3>
              </div>
            </div>

            {/* Beautiful Custom Motherboard Schematic SVG layout */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-950/40 border-b border-zinc-100 dark:border-zinc-850 flex flex-col items-center justify-center min-h-[160px]">
              <svg className="w-full max-w-[240px] h-32 text-zinc-300 dark:text-zinc-800" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Circuit lines */}
                <rect x="2" y="2" width="196" height="96" rx="4" className="stroke-zinc-400 dark:stroke-zinc-800 stroke-2" fill="none" />
                <rect x="15" y="15" width="40" height="40" rx="2" className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-400 dark:stroke-zinc-700" />
                <text x="35" y="38" textAnchor="middle" className="text-[8px] font-mono fill-zinc-500 font-bold">STM32</text>
                
                {/* Circuit paths to channels */}
                <path d="M 55 35 L 140 35 M 55 45 L 140 45 M 55 25 L 140 25 M 55 55 L 140 55 M 55 60 L 140 60" className="stroke-zinc-300 dark:stroke-zinc-900 stroke-1" strokeDasharray="3 3" />
                
                {/* Diodes matching the channel checkbox and slider brightness highlights */}
                {channels.map((ch, idx) => {
                  const diodeColor = ch.enabled 
                    ? ch.value > 80 
                      ? 'fill-red-500' // Red high value warning state
                      : 'fill-emerald-400' 
                    : 'fill-zinc-300 dark:fill-zinc-800';
                  return (
                    <g key={ch.id} className="cursor-pointer" onClick={() => handleChannelCheckboxChange(ch.id, !ch.enabled)}>
                      <circle cx="150" cy={15 + idx * 17} r="4" className={`${diodeColor}`} />
                      <circle cx="150" cy={15 + idx * 17} r="6" className={`stroke-2 animate-pulse stroke-zinc-200 dark:stroke-zinc-900 fill-none ${ch.enabled ? '' : 'hidden'}`} />
                      <text x="162" y={18 + idx * 17} className="text-[7px] font-mono fill-zinc-600 font-semibold uppercase">{ch.name}</text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="p-4 space-y-2 border-t border-zinc-100 dark:border-zinc-850 font-mono text-[10px] text-zinc-500 text-left">
              <p>● Motherboard model: STM32F4-DISCOVERY</p>
              <p>● Live active diode state tracks CH_01 to CH_05 duty values.</p>
            </div>
          </section>

        </aside>

      </div>

      {/* CHANNEL & PWM CONTROL FOR THE BOTTOM ROW */}
      <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 p-6 rounded-lg flex flex-col shadow-sm text-left">
        
        {/* Section title & toggles */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6 pb-4 border-b border-zinc-150 dark:border-zinc-805">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-zinc-505" />
            <h3 className="text-xs font-bold tracking-wider font-mono text-zinc-900 dark:text-zinc-100 uppercase">
              CHANNEL REGISTER & PWM POWER CONTROL
            </h3>
          </div>

          <div className="flex gap-4 font-mono text-[10px] font-bold text-zinc-505 uppercase">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={channelEnable} 
                onChange={(e) => setChannelEnable(e.target.checked)}
                className="rounded border-zinc-300 text-zinc-900 focus:ring-0" 
              />
              <span>GLOBAL CHANNEL ENABLE</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={passthruEnable} 
                onChange={(e) => setPassthruEnable(e.target.checked)}
                className="rounded border-zinc-300 text-zinc-900 focus:ring-0" 
              />
              <span>PASSTHRU MODE ENABLE</span>
            </label>
          </div>
        </div>

        {/* Channels Inputs list */}
        <div className="space-y-4">
          {channels.map((ch) => (
            <div 
              key={ch.id} 
              className={`flex flex-col sm:flex-row sm:items-center gap-4 p-3 border border-zinc-100 dark:border-zinc-800 rounded transition-all ${
                ch.enabled ? 'bg-zinc-50/50 dark:bg-zinc-900/30' : 'opacity-60 bg-zinc-50/20'
              }`}
            >
              {/* Channel Label */}
              <div className="flex items-center gap-3 w-20 shrink-0">
                <input 
                  type="checkbox" 
                  checked={ch.enabled} 
                  onChange={(e) => handleChannelCheckboxChange(ch.id, e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-200">{ch.name}</span>
              </div>

              {/* Slider power meter */}
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 accent-zinc-900 dark:accent-zinc-100 rounded-lg cursor-pointer"
                  disabled={!ch.enabled || !channelEnable}
                  value={ch.value}
                  onChange={(e) => handleSliderChange(ch.id, parseInt(e.target.value))}
                />
                <span className="w-12 text-right font-mono text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                  {ch.value}%
                </span>
              </div>

              {/* Hex selector value preview */}
              <div className="w-28 shrink-0 flex items-center gap-2">
                <span className="text-[10px] text-zinc-400 font-mono">HEX:</span>
                <select 
                  className="bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-[11px] font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-50 rounded"
                  value={ch.value}
                  disabled={!ch.enabled || !channelEnable}
                  onChange={(e) => handleSliderChange(ch.id, parseInt(e.target.value))}
                >
                  <option value={0}>0x00</option>
                  <option value={16}>0x10</option>
                  <option value={32}>0x20</option>
                  <option value={48}>0x30</option>
                  <option value={64}>0x40</option>
                  <option value={80}>0x50</option>
                  <option value={100}>0xFF</option>
                  {![0, 16, 32, 48, 64, 80, 100].includes(ch.value) && (
                    <option value={ch.value}>{calcHex(ch.value)}</option>
                  )}
                </select>
              </div>

            </div>
          ))}
        </div>

        {/* Submit Actions Area */}
        <div className="mt-6 flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-805">
          <p className="text-[10px] font-mono text-zinc-400">
            * Adjust PWM slider meters to directly control STM32 system physical outputs.
          </p>

          <button
            onClick={submitPwmSettings}
            className="h-11 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs font-bold tracking-widest uppercase rounded px-8 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] active:scale-95 transition-all"
          >
            WRITE FLASH REGISTERS [PWM SET]
          </button>
        </div>

      </section>

    </div>
  );
}
