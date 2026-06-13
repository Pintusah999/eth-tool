import React, { useState } from 'react';
import { Shield, Hammer, Clipboard, AlertTriangle, FileSpreadsheet, Trash } from 'lucide-react';
import { LogLine } from '../types';

export default function DbgTestingTab() {
  const [dbgEnable, setDbgEnable] = useState(true);
  const [udpActive, setUdpActive] = useState(true);
  
  // Channels selects
  const [ch1Value, setCh1Value] = useState('00');
  const [ch2Value, setCh2Value] = useState('00');
  const [ch3Value, setCh3Value] = useState('16');
  const [ch4Value, setCh4Value] = useState('00');
  const [ch5Value, setCh5Value] = useState('32');

  // Logs stream mock lists
  const [logs, setLogs] = useState<LogLine[]>([
    { timestamp: '14:22:01.884', originIp: '192.168.1.105', method: 'GET_STATUS', ch1: 0.02, ch2: 0.01, ch3: 0.45, ch4: 0.02, ch5: 0.00, sigmaCurr: 0.50, volt: 12.04, temp: 42.4 },
    { timestamp: '14:22:05.121', originIp: '192.168.1.105', method: 'PWM_SET', ch1: 0.12, ch2: 0.12, ch3: 0.12, ch4: 0.12, ch5: 0.12, sigmaCurr: 0.60, volt: 12.02, temp: 43.1 },
    { timestamp: '14:23:18.423', originIp: '192.168.1.105', method: 'READ_TEMP', ch1: 0.02, ch2: 0.01, ch3: 0.44, ch4: 0.01, ch5: 0.32, sigmaCurr: 0.80, volt: 12.05, temp: 44.8 },
    { timestamp: '14:24:45.908', originIp: '192.168.1.105', method: 'UDP_PUSH', ch1: 0.01, ch2: 0.01, ch3: 0.45, ch4: 0.01, ch5: 0.35, sigmaCurr: 0.83, volt: 11.98, temp: 45.2 },
    { timestamp: '14:25:02.115', originIp: '192.168.1.105', method: 'SET_PORT', ch1: 0.00, ch2: 0.00, ch3: 0.16, ch4: 0.00, ch5: 0.32, sigmaCurr: 0.48, volt: 12.01, temp: 41.2 }
  ]);

  // Fault alerts toggles
  const [faultAlerts, setFaultAlerts] = useState({
    voltage: false,
    highTemp: false,
    totalCurrent: false,
    ch5Current: false,
    ch4Current: false,
    ch3Current: false,
    ch2Current: false,
    ch1Current: false
  });

  const toggleFault = (faultKey: keyof typeof faultAlerts, label: string) => {
    const nextState = !faultAlerts[faultKey];
    setFaultAlerts(prev => ({ ...prev, [faultKey]: nextState }));
    
    // Add fault log stream row
    if (nextState) {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
      const newErrLog: LogLine = {
        timestamp: timeStr,
        originIp: '192.168.1.105',
        method: `FAULT_${label.replace(/\s+/g, '_').toUpperCase()}`,
        ch1: 0.00, ch2: 0.00, ch3: 0.00, ch4: 0.00, ch5: 0.00,
        sigmaCurr: 0.00,
        volt: faultKey === 'voltage' ? 15.32 : 12.04,
        temp: faultKey === 'highTemp' ? 92.4 : 42.4
      };
      setLogs(prev => [newErrLog, ...prev]);
    }
  };

  const clearFaults = () => {
    setFaultAlerts({
      voltage: false,
      highTemp: false,
      totalCurrent: false,
      ch5Current: false,
      ch4Current: false,
      ch3Current: false,
      ch2Current: false,
      ch1Current: false
    });
  };

  const hasAnyFault = Object.values(faultAlerts).some(v => v);

  const writePortConfig = () => {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
    const newLog: LogLine = {
      timestamp: timeStr,
      originIp: '192.168.1.105',
      method: 'PORT_A_ALIGN',
      ch1: parseFloat(ch1Value) / 100,
      ch2: parseFloat(ch2Value) / 100,
      ch3: parseFloat(ch3Value) / 100,
      ch4: parseFloat(ch4Value) / 100,
      ch5: parseFloat(ch5Value) / 100,
      sigmaCurr: 1.15,
      volt: 12.03,
      temp: 45.6
    };
    setLogs(prev => [newLog, ...prev]);
    alert(`PWM Port Config set: CH1=${ch1Value}, CH2=${ch2Value}, CH3=${ch3Value}, CH4=${ch4Value}, CH5=${ch5Value}`);
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-4 p-4 font-sans overflow-auto text-left">
      
      {/* Left Columns - Configuration & log table */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* PWM PORT CONFIGURATION CARD */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 p-6 rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-150 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-zinc-950 dark:bg-zinc-100" />
              <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
                PWM PORT CONFIGURATION
              </h2>
            </div>

            {/* DBG Enable and UDP state */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer group text-xs font-mono font-bold text-zinc-500 uppercase">
                <input 
                  type="checkbox" 
                  checked={dbgEnable} 
                  onChange={(e) => setDbgEnable(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-950 focus:ring-0 w-3.5 h-3.5" 
                />
                <span className="group-hover:text-zinc-900 dark:group-hover:text-zinc-250 transition-colors">DBG Enable</span>
              </label>

              <button 
                onClick={() => setUdpActive(!udpActive)}
                className={`flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 rounded text-[10px] font-mono font-bold tracking-wider uppercase shadow-sm transition-all active:scale-95 ${
                  udpActive ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{udpActive ? 'UDP MODE ACTIVE' : 'UDP MODE INACTIVE'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-4 font-mono text-[11px]">
            <div className="grid grid-cols-5 gap-2.5 flex-1">
              
              {/* CH1 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-0.5">CH_01</label>
                <select 
                  className="w-full bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-50 p-2 rounded"
                  value={ch1Value}
                  onChange={(e) => setCh1Value(e.target.value)}
                >
                  <option value="00">00</option>
                  <option value="16">16</option>
                  <option value="32">32</option>
                </select>
              </div>

              {/* CH2 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-0.5">CH_02</label>
                <select 
                  className="w-full bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-50 p-2 rounded"
                  value={ch2Value}
                  onChange={(e) => setCh2Value(e.target.value)}
                >
                  <option value="00">00</option>
                  <option value="16">16</option>
                  <option value="32">32</option>
                </select>
              </div>

              {/* CH3 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-0.5">CH_03</label>
                <select 
                  className="w-full bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-50 p-2 rounded"
                  value={ch3Value}
                  onChange={(e) => setCh3Value(e.target.value)}
                >
                  <option value="00">00</option>
                  <option value="16">16</option>
                  <option value="32">32</option>
                </select>
              </div>

              {/* CH4 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-0.5">CH_04</label>
                <select 
                  className="w-full bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-50 p-2 rounded"
                  value={ch4Value}
                  onChange={(e) => setCh4Value(e.target.value)}
                >
                  <option value="00">00</option>
                  <option value="16">16</option>
                  <option value="32">32</option>
                </select>
              </div>

              {/* CH5 */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block px-0.5">CH_05</label>
                <select 
                  className="w-full bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-50 p-2 rounded"
                  value={ch5Value}
                  onChange={(e) => setCh5Value(e.target.value)}
                >
                  <option value="00">00</option>
                  <option value="16">16</option>
                  <option value="32">32</option>
                </select>
              </div>

            </div>

            <button
              onClick={writePortConfig}
              className="h-9 shrink-0 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-850 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 px-6 font-mono text-xs font-bold tracking-widest rounded uppercase transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.05)] active:scale-95"
            >
              SET PORT-A
            </button>
          </div>
        </section>

        {/* SYSTEM LOG STREAM CONTAINER */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg flex-1 overflow-hidden flex flex-col shadow-sm">
          
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center p-4 border-b border-zinc-150 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-950/15">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-4 bg-zinc-950 dark:bg-zinc-50" />
              <h3 className="text-xs font-bold font-mono tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
                SYSTEM REGISTER LOGGER STREAM
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 bg-white dark:bg-zinc-950 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase cursor-pointer hover:border-zinc-950 transition-colors rounded">
                <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-zinc-950 focus:ring-0 w-3.5 h-3.5" />
                <span>SAVE LOG</span>
              </label>

              <button 
                onClick={() => setLogs([])}
                className="flex items-center gap-1 py-1 px-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 rounded tracking-wide text-[10px] font-mono font-bold transition-colors uppercase active:scale-95"
              >
                <Trash className="w-3.5 h-3.5" />
                <span>CLEAR LOG</span>
              </button>

              <button 
                onClick={() => alert("Simulation compiled logs saved.")}
                className="flex items-center gap-1 py-1 px-3 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded tracking-wide text-[10px] font-mono font-bold transition-colors uppercase active:scale-95"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>EXPORT LOG</span>
              </button>
            </div>
          </div>

          <div className="overflow-auto flex-1 max-h-[360px]">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="sticky top-0 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 z-10 font-mono text-[10px] font-bold tracking-widest text-zinc-400 select-none">
                <tr>
                  <th className="px-4 py-3">TIME_STAMP</th>
                  <th className="px-4 py-3">ORIGIN_IP</th>
                  <th className="px-4 py-3">METHOD</th>
                  <th className="px-4 py-3 text-center">CH1(A)</th>
                  <th className="px-4 py-3 text-center">CH2(A)</th>
                  <th className="px-4 py-3 text-center">CH3(A)</th>
                  <th className="px-4 py-3 text-center">CH4(A)</th>
                  <th className="px-4 py-3 text-center">CH5(A)</th>
                  <th className="px-4 py-3 text-center">Σ CURR</th>
                  <th className="px-4 py-3 text-center">VOLT(V)</th>
                  <th className="px-4 py-3 text-center">TEMP(℃)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 bg-white dark:bg-zinc-900 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                {logs.map((log, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-zinc-50 dark:hover:bg-zinc-950/30 transition-colors ${
                      log.method.startsWith('FAULT_') ? 'bg-red-50/40 dark:bg-red-950/10 text-red-650' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 font-bold">{log.timestamp}</td>
                    <td className="px-4 py-2.5 text-zinc-500">{log.originIp}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.method.startsWith('FAULT_') 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600' 
                          : 'bg-zinc-100 dark:bg-zinc-850 text-zinc-800 dark:text-zinc-300'
                      }`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">{log.ch1.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-center">{log.ch2.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-center">{log.ch3.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-center">{log.ch4.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-center">{log.ch5.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-center font-bold text-zinc-900 dark:text-zinc-100">{log.sigmaCurr.toFixed(2)}</td>
                    <td className={`px-4 py-2.5 text-center ${log.volt > 14 ? 'text-red-500 font-bold' : ''}`}>{log.volt.toFixed(2)}</td>
                    <td className={`px-4 py-2.5 text-center ${log.temp > 80 ? 'text-red-500 font-bold' : ''}`}>{log.temp.toFixed(1)}</td>
                  </tr>
                ))}
                
                {/* Visual filler rows matching screenshot */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-10 opacity-10">
                    <td colSpan={11} className="px-4 border-b border-zinc-100 dark:border-zinc-800"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Right Column Sidebars (DEVICE DETAILS + FAULT STATUS) */}
      <aside className="w-full xl:w-80 shrink-0 flex flex-col gap-4">
        
        {/* Device details */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/25 border-b border-zinc-100 dark:border-zinc-805 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <Clipboard className="w-3.5 h-3.5 text-zinc-500" />
              <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase">
                DEVICE HARDWARE STATE
              </h3>
            </div>
          </div>

          <div className="p-5 space-y-4 font-mono text-[11px]">
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Name</span>
              <span className="text-zinc-950 dark:text-zinc-50 font-sans font-bold text-xs">SGI-DBG-UNIT-A1</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Manufacturer</span>
              <span className="text-zinc-700 dark:text-zinc-300">SGI Systems Ltd.</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">IP Address</span>
              <span className="text-zinc-800 dark:text-zinc-200">192.168.1.105</span>
            </div>
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">MAC Address</span>
              <span className="text-zinc-600 dark:text-zinc-400">00:1B:44:11:3A:B7</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Status</span>
              <div className="flex items-center gap-1.5 px-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 uppercase">CONNECTED</span>
              </div>
            </div>
          </div>
        </section>

        {/* SYSTEM FAULT STATUS (INTEGRATED INTERACTION) */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg overflow-hidden flex-1 flex flex-col shadow-sm">
          <div className="px-4 py-3 bg-zinc-52 dark:bg-zinc-950/25 border-b border-zinc-100 dark:border-zinc-805 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <AlertTriangle className="w-3.5 h-3.5 text-zinc-500" />
              <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase">
                SYSTEM FAULT STATUS
              </h3>
            </div>
            {hasAnyFault && (
              <button 
                onClick={clearFaults}
                className="text-[9px] font-bold font-mono text-red-500 hover:underline hover:text-red-650 transition-all"
              >
                CLEAR ALL
              </button>
            )}
          </div>

          <div className="p-4 space-y-2 flex-1 overflow-y-auto">
            
            {/* Interactive Fault items triggers */}
            {[
              { key: 'voltage', label: 'Voltage Fault' },
              { key: 'highTemp', label: 'High Temp Fault' },
              { key: 'totalCurrent', label: 'Total Current Fault' },
              { key: 'ch5Current', label: 'CH5 Current Fault' },
              { key: 'ch4Current', label: 'CH4 Current Fault' },
              { key: 'ch3Current', label: 'CH3 Current Fault' },
              { key: 'ch2Current', label: 'CH2 Current Fault' },
              { key: 'ch1Current', label: 'CH1 Current Fault' }
            ].map((f) => {
              const isTriggered = faultAlerts[f.key as keyof typeof faultAlerts];
              return (
                <button
                  key={f.key}
                  onClick={() => toggleFault(f.key as keyof typeof faultAlerts, f.label)}
                  className={`w-full flex items-center justify-between p-2.5 border rounded text-xs text-left font-sans font-medium transition-all group ${
                    isTriggered 
                      ? 'border-red-300 bg-red-50/60 dark:bg-red-950/20 text-red-650 hover:bg-red-50' 
                      : 'border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-500 dark:text-zinc-400 hover:border-zinc-950 hover:text-zinc-950 dark:hover:text-zinc-100 dark:hover:border-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full transition-all ${
                      isTriggered ? 'bg-red-500 animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700'
                    }`} />
                    <span className="font-mono text-[11px] font-semibold">{f.label}</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold uppercase transition-colors px-1.5 rounded ${
                    isTriggered ? 'bg-red-100 text-red-700' : 'text-zinc-300'
                  }`}>
                    {isTriggered ? 'TRIP' : 'SAFE'}
                  </span>
                </button>
              );
            })}

            {/* Bottom Status strip */}
            {hasAnyFault ? (
              <div className="flex items-center gap-2.5 p-3.5 border-2 border-red-500 bg-red-50 text-red-750 mt-4 font-mono text-[10px] font-bold uppercase tracking-wider rounded">
                <AlertTriangle className="w-4.5 h-4.5 text-red-500 animate-bounce" />
                <span>FAULT DETECT TRIP ACTIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3.5 border-2 border-zinc-950 bg-zinc-950 dark:border-zinc-50 dark:bg-zinc-50 text-white dark:text-zinc-950 mt-4 font-mono text-[10px] font-bold uppercase tracking-widest rounded transition-all">
                <Shield className="w-4.5 h-4.5" />
                <span>ALL SYSTEMS GOOD</span>
              </div>
            )}

          </div>
        </section>

      </aside>

    </div>
  );
}
