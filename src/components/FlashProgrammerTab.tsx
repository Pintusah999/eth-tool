import React, { useState } from 'react';
import { Layers, HelpCircle, Shield, Radio, Check, Play, RefreshCw, Cpu, Code } from 'lucide-react';

export default function FlashProgrammerTab() {
  const [sourceMode, setSourceMode] = useState<'device' | 'file'>('device');
  const [address, setAddress] = useState('0x08000000');
  const [size, setSize] = useState('0x400');
  const [dataWidth, setDataWidth] = useState('32-bit');
  const [findData, setFindData] = useState('');

  // ST-LINK states
  const [stConnected, setStConnected] = useState(false);
  const [stConnecting, setStConnecting] = useState(false);
  const [stLowPower, setStLowPower] = useState(true);
  const [stFrequency, setStFrequency] = useState('4000');
  const [stPort, setStPort] = useState<'SWD' | 'JTAG'>('SWD');
  const [stMode, setStMode] = useState('Normal');

  // ST-LINK log traces
  const [stLogs, setStLogs] = useState<string[]>([
    'ST-LINK DLL v3.11.3 loaded.',
    'API version: v3',
    'Ready.'
  ]);

  const handleStConnect = () => {
    if (stConnected) {
      setStConnected(false);
      setStLogs(prev => [
        ...prev,
        '[INFO] Closing link connection with ST-LINK probe...',
        '[SUCCESS] ST-LINK disconnected.'
      ]);
      return;
    }

    setStConnecting(true);
    setStLogs(prev => [
      ...prev,
      '[INFO] Connecting to ST-LINK/V2-1 066EFF535651 via SWD...',
      `[INFO] Target frequency set to ${stFrequency} KHz.`
    ]);

    setTimeout(() => {
      setStConnecting(false);
      setStConnected(true);
      setStLogs(prev => [
        ...prev,
        '[SUCCESS] ST-LINK Connected.',
        'Target voltage: 3.24V',
        'Device ID: 0x411 (Cortex-M4)',
        '[SUCCESS] Target halted.'
      ]);
    }, 1000);
  };

  const executeUpgrade = () => {
    setStLogs(prev => [
      ...prev,
      '[UPGRADE] Contacting ST-LINK firmware update server...',
      '[UPGRADE] Latest bootloader firmware is already installed. (v2.J34.S7)'
    ]);
    alert("ST-LINK Probe Firmware: Up to date (v2.J34.S7 ST-LINK/V2-1)");
  };

  // Realistic sample hex generator
  const getHexRow = (addrOffset: number) => {
    const baseAddr = 0x08000000 + addrOffset;
    const addrHex = baseAddr.toString(16).toUpperCase().padStart(8, '0');
    
    // Predetermined hex characters
    const hexBytes = [
      '20', '00', '04', '20', 'D1', '00', '00', '08', 
      'D5', '00', '00', '08', 'D9', '00', '00', '08',
      'DB', '00', '00', '08', 'DD', '00', '00', '08'
    ];
    
    // Crop list to 16 bytes format representation
    const sliceBytes = hexBytes.slice(0, 16).map(b => {
      // Shift bytes based on hex finder match if applicable
      if (findData && b === findData.toUpperCase()) {
        return `<span class="bg-amber-400 text-zinc-950 px-0.5 rounded font-bold">${b}</span>`;
      }
      return b;
    });

    const asciiString = '. . . . . . . . . . . . . . . .';
    return {
      address: addrHex,
      bytes: sliceBytes,
      ascii: asciiString
    };
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-4 p-4 font-sans overflow-auto text-left">
      
      {/* Left panel columns */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* MEMORY & FILE EDITING CARD */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-1.5 h-4 bg-zinc-950 dark:bg-zinc-50" />
            <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
              MEMORY & BINARY FILE EDITING
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end font-mono text-[11px]">
            
            {/* Source Mode Option */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-0.5">SOURCE TARGET</label>
              <div className="flex bg-zinc-50 dark:bg-zinc-950 p-1 border border-zinc-200 dark:border-zinc-800 rounded">
                <button
                  onClick={() => setSourceMode('device')}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded text-center transition-colors ${
                    sourceMode === 'device' 
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold' 
                      : 'text-zinc-500'
                  }`}
                >
                  DEVICE MEMORY
                </button>
                <button
                  onClick={() => setSourceMode('file')}
                  className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded text-center transition-colors ${
                    sourceMode === 'file' 
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold' 
                      : 'text-zinc-500'
                  }`}
                >
                  OPEN FILE
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-0.5">ADDRESS BASE</label>
              <input
                type="text"
                className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-zinc-950 font-mono text-xs rounded text-zinc-850 dark:text-zinc-200"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x08000000"
              />
            </div>

            {/* Size */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-0.5">BURST SIZE</label>
              <input
                type="text"
                className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-zinc-950 font-mono text-xs rounded text-zinc-850 dark:text-zinc-200"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="0x400"
              />
            </div>

            {/* Data Width */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-0.5">DATA WIDTH</label>
              <select
                className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:outline-none focus:border-zinc-950 font-mono text-xs rounded text-zinc-850 dark:text-zinc-200"
                value={dataWidth}
                onChange={(e) => setDataWidth(e.target.value)}
              >
                <option value="8-bit">8-bit word alignment</option>
                <option value="16-bit">16-bit word alignment</option>
                <option value="32-bit">32-bit word alignment</option>
              </select>
            </div>

          </div>

          {/* Find Data search parameter */}
          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center gap-3">
            <span className="text-[10px] font-bold font-mono tracking-widest text-zinc-450 uppercase shrink-0">Find Data:</span>
            <input 
              type="text"
              className="max-w-xs h-8 px-2.5 border border-zinc-200 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono rounded"
              placeholder="Hex string (e.g. D1)"
              value={findData}
              onChange={(e) => setFindData(e.target.value)}
            />
          </div>
        </section>

        {/* DETAILS TABLE HEX DISPLAYS */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg flex-1 overflow-hidden flex flex-col shadow-sm select-all">
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-805 bg-zinc-50/50 dark:bg-zinc-950/20">
            <h3 className="text-[10px] font-bold font-mono tracking-widest text-zinc-500 uppercase">
              TARGET HARDWARE FLASH HEX DUMP
            </h3>
          </div>

          <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[290px] overflow-auto">
            {stConnected ? (
              <div className="w-full text-left font-mono text-xs text-zinc-800 dark:text-zinc-200 space-y-1.5 overflow-x-auto select-text">
                <div className="text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
                  <span>ADDRESS  | 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F | ASCII STREAM</span>
                </div>
                {Array.from({ length: 12 }).map((_, i) => {
                  const dataRow = getHexRow(i * 16);
                  return (
                    <div key={i} className="flex gap-4">
                      <span className="text-zinc-400 font-bold">{dataRow.address}:</span>
                      <span className="text-zinc-950 dark:text-zinc-200" dangerouslySetInnerHTML={{ __html: dataRow.bytes.join(' ') }} />
                      <span className="text-zinc-400 border-l border-zinc-100 dark:border-zinc-800 pl-4">{dataRow.ascii}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center font-sans space-y-4 max-w-sm">
                <Code className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto" />
                <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wide">
                  No data to display. Connect a target to read memory.
                </p>
                <button
                  onClick={handleStConnect}
                  className="h-9 px-4 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 hover:border-zinc-950 dark:hover:bg-zinc-800 dark:hover:border-zinc-50 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all"
                >
                  CONNECT ST-LINK PROBE
                </button>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Right Column: ST-LINK Settings & mini logger */}
      <aside className="w-full xl:w-96 shrink-0 flex flex-col gap-4">
        
        {/* ST-LINK SETTINGS CARD */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/25 border-b border-zinc-100 dark:border-zinc-805 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-850 dark:text-zinc-200">
              <Cpu className="w-3.5 h-3.5 text-zinc-550" />
              <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase">
                ST-LINK CONFIGURATION
              </h3>
            </div>
          </div>

          <div className="p-5 space-y-5 font-mono text-[11px]">
            
            {/* Serial Number */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Probe Serial</label>
              <select className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-[11px] rounded">
                <option>ST-LINK/V2-1 066EFF535651</option>
                <option>ST-LINK/V3-MINI 882AA2E401</option>
              </select>
            </div>

            {/* Port & Frequency */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Port Interface</label>
                <div className="flex bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-200 rounded p-0.5">
                  <button 
                    onClick={() => setStPort('SWD')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded ${stPort === 'SWD' ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'text-zinc-500'}`}
                  >
                    SWD
                  </button>
                  <button 
                    onClick={() => setStPort('JTAG')}
                    className={`flex-1 py-1 text-[10px] font-bold rounded ${stPort === 'JTAG' ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' : 'text-zinc-500'}`}
                  >
                    JTAG
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Freq (KHz)</label>
                <select 
                  className="w-full h-8 px-2 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-[11px] rounded"
                  value={stFrequency}
                  onChange={(e) => setStFrequency(e.target.value)}
                >
                  <option value="4000">4000</option>
                  <option value="1800">1800</option>
                  <option value="950">950</option>
                  <option value="480">480</option>
                </select>
              </div>
            </div>

            {/* Connection Mode */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Connect Mode</label>
              <select 
                className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-[11px] rounded"
                value={stMode}
                onChange={(e) => setStMode(e.target.value)}
              >
                <option value="Normal">Normal Mode</option>
                <option value="HotPlug">HotPlug Connection</option>
                <option value="UnderReset">Connect Under Reset</option>
              </select>
            </div>

            {/* Debug in Low Power mode */}
            <label className="flex items-center gap-2 pt-1 font-bold text-zinc-500 hover:text-zinc-950 transition-colors cursor-pointer text-[10px] uppercase">
              <input 
                type="checkbox" 
                checked={stLowPower}
                onChange={(e) => setStLowPower(e.target.checked)}
                className="rounded border-zinc-300 text-zinc-950 focus:ring-0 w-3.5 h-3.5" 
              />
              <span>Debug in Low Power mode</span>
            </label>

            {/* Actions list triggers */}
            <div className="flex flex-col gap-2 pt-3">
              <button
                onClick={handleStConnect}
                disabled={stConnecting}
                className={`w-full h-10 font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded transition-all active:scale-95 border ${
                  stConnected 
                    ? 'border-red-200 bg-red-50 text-red-650 hover:bg-red-100' 
                    : 'bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 border-transparent hover:opacity-90'
                }`}
              >
                {stConnecting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Halting devices...</span>
                  </>
                ) : stConnected ? (
                  <>
                    <span>DISCONNECT CLIENT</span>
                  </>
                ) : (
                  <>
                    <span>CONNECT ST-LINK</span>
                  </>
                )}
              </button>

              <button
                onClick={executeUpgrade}
                className="w-full h-10 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs font-bold tracking-widest uppercase rounded flex items-center justify-center hover:bg-zinc-100 transition-colors active:scale-95"
              >
                FIRMWARE UPGRADE
              </button>
            </div>

          </div>
        </section>

        {/* MINI CONSOLE LOG FOR STLINK */}
        <section className="bg-zinc-950 text-emerald-440 border border-zinc-90 rounded-lg overflow-hidden flex-1 flex flex-col p-4 font-mono min-h-[140px] max-h-[180px]">
          <div className="border-b border-emerald-950/45 pb-1.5 mb-2 text-left flex justify-between select-none">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">ST-LINK ENGINE LOGGER</span>
            <span className="text-[10px] text-zinc-600">v3.11</span>
          </div>

          <div className="flex-1 overflow-y-auto text-left space-y-1 text-[11px] text-zinc-400">
            {stLogs.map((log, i) => (
              <div 
                key={i} 
                className={
                  log.startsWith('[SUCCESS]') 
                    ? 'text-emerald-400' 
                    : log.startsWith('[INFO]') 
                      ? 'text-zinc-500 font-bold' 
                      : 'text-zinc-400'
                }
              >
                {log}
              </div>
            ))}
          </div>
        </section>

      </aside>

    </div>
  );
}
