import React, { useState, useEffect, useRef } from 'react';
import { Upload, Terminal, Shield, FileText, Trash2, Download, Play, Check, RefreshCw } from 'lucide-react';

export default function FtpConnectTab() {
  const [selectedFile, setSelectedFile] = useState('');
  const [otaProgress, setOtaProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Terminal Logs state
  const [logs, setLogs] = useState<string[]>([
    '// System ready. Waiting for connection...',
    '[INFO] Application v2.4.0 started successfully',
    '[INFO] Network interface: OK',
    '[WARN] FTP connection not established. Use \'Connect\' to initialize.'
  ]);
  const [cmdInput, setCmdInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Handle command submissions
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    const cmd = cmdInput.trim().toLowerCase();
    const newLogs = [...logs, `user@techsuite:~$ ${cmdInput}`];

    switch (cmd) {
      case 'help':
        newLogs.push(
          'Available commands:',
          '  help       - Print this menu list',
          '  connect    - Open FTP handshake stream',
          '  disconnect - Terminate FTP stream session',
          '  upload     - OTA FLASH partition writing',
          '  status     - Interrogate active hardware state',
          '  clear      - Purge console log stream'
        );
        break;
      case 'connect':
        if (isConnected) {
          newLogs.push('[WARN] Active channel already connected. Status: OK.');
        } else {
          setIsConnecting(true);
          newLogs.push('[INFO] Initiating TCP connection to 192.168.1.105:21...');
          setTimeout(() => {
            setIsConnected(true);
            setIsConnecting(false);
            setLogs(prev => [
              ...prev,
              '[SUCCESS] handshake completed: SGI DBG FTP Control Port v2.4',
              '[INFO] User authorized. Mode set to BINARY.',
              '[INFO] Target ready for OTA system writing.'
            ]);
          }, 1000);
        }
        break;
      case 'disconnect':
        if (!isConnected) {
          newLogs.push('[WARN] Socket closed. No active connection.');
        } else {
          setIsConnected(false);
          newLogs.push('[INFO] Teardown TCP handle with 192.168.1.105...');
          newLogs.push('[SUCCESS] Client session terminated.');
        }
        break;
      case 'upload':
        if (!isConnected) {
          newLogs.push('[ERROR] Execution blocked: connect with target server first.');
        } else if (!selectedFile) {
          newLogs.push('[ERROR] No binary specified. Select target file first.');
        } else {
          setIsUploading(true);
          setOtaProgress(0);
          newLogs.push(`[INFO] Reading ${selectedFile} into payload frame...`);
        }
        break;
      case 'status':
        newLogs.push(
          '--- LOCAL NODE STATUS ---',
          `Connection: ${isConnected ? 'ACTIVE (FTP)' : 'DISCONNECTED'}`,
          `Selected File: ${selectedFile || 'NONE'}`,
          'Gateway Route: 192.168.1.1',
          'Node Base ID: SGI-DBG-UNIT-A1',
          'Firmware Target: V2J34S7 ST-LINK/V2-1'
        );
        break;
      case 'clear':
        setLogs([]);
        setCmdInput('');
        return;
      default:
        newLogs.push(`[ERROR] Unknown command: "${cmd}". Type "help" for a list of commands.`);
    }

    setLogs(newLogs);
    setCmdInput('');
  };

  // Simulate file upload progress
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isUploading) {
      timer = setInterval(() => {
        setOtaProgress(prev => {
          if (prev >= 100) {
            setIsUploading(false);
            setLogs(prevLogs => [
              ...prevLogs,
              `[SUCCESS] 524KB written successfully to flash partition 0x08000000`,
              `[INFO] Recalculating CRC checksum... OK`,
              `[SUCCESS] OTA cycle complete. Target reboot requested.`
            ]);
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
    return () => clearInterval(timer);
  }, [isUploading]);

  const selectPresetBinary = (fileName: string) => {
    setSelectedFile(fileName);
    setLogs(prev => [...prev, `[INFO] Selected local firmware payload: "${fileName}"`]);
  };

  const handleConnectClick = () => {
    if (isConnected) {
      setIsConnected(false);
      setLogs(prev => [...prev, '[INFO] Disconnected node FTP session manually.']);
    } else {
      setIsConnecting(true);
      setLogs(prev => [...prev, '[INFO] Connecting to target node... Handshaking sockets...']);
      setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
        setLogs(prev => [
          ...prev,
          '[SUCCESS] Handshake complete.',
          '[INFO] Port 21 (FTP Data Stream) connected.'
        ]);
      }, 800);
    }
  };

  const handleUploadClick = () => {
    if (!isConnected) {
      setLogs(prev => [...prev, '[ERROR] Please connect to device first.']);
      return;
    }
    if (!selectedFile) {
      setLogs(prev => [...prev, '[ERROR] No firmware binary specified. Select a binary file.']);
      return;
    }
    setIsUploading(true);
    setOtaProgress(0);
    setLogs(prev => [...prev, `[INFO] Initiating frame writing protocol... File: ${selectedFile}`]);
  };

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 font-sans overflow-auto">
      
      {/* Top panel rows (OTA UPDATE + DEVICE DETAILS) */}
      <div className="flex flex-col xl:flex-row gap-4">
        
        {/* OTA UPDATE CARD */}
        <section className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-1.5 h-4 bg-zinc-950 dark:bg-zinc-50" />
            <h2 className="text-xs font-bold tracking-wider font-mono text-zinc-900 dark:text-zinc-100 uppercase">
              OTA UPDATE CONFIGURATION
            </h2>
          </div>

          <div className="space-y-5">
            {/* File Path input container */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                Target Binary File Payload
              </label>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  className="w-full h-10 px-3.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 font-mono text-xs rounded text-zinc-800 dark:text-zinc-200"
                  placeholder="Select a binary file payload..."
                  value={selectedFile}
                />
                
                {/* Minimal Browser button preset triggers */}
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => selectPresetBinary('app_patch_v2.4.1.bin')}
                    className="h-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[10px] px-3 rounded font-mono font-bold tracking-tight text-zinc-700 dark:text-zinc-300 active:scale-95 transition-all"
                  >
                    PATCH.BIN
                  </button>
                  <button
                    onClick={() => selectPresetBinary('firmware_recovery.bin')}
                    className="h-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-[10px] px-3 rounded font-mono font-bold tracking-tight text-zinc-700 dark:text-zinc-300 active:scale-95 transition-all"
                  >
                    RECOVER.BIN
                  </button>
                </div>
              </div>
            </div>

            {/* Upload Progress Metrics */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-1.5 label text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                <span>OTA Writing Frame progress</span>
                <span>{otaProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-950 dark:bg-zinc-50 rounded-full transition-all duration-150"
                  style={{ width: `${otaProgress}%` }}
                />
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleUploadClick}
                disabled={isUploading || !selectedFile || !isConnected}
                className="flex-1 h-10 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs font-bold tracking-wider rounded uppercase flex items-center justify-center gap-2 checked:bg-emerald-500 shadow-[1px_1px_2px_rgba(0,0,0,0.05)] disabled:opacity-50 transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'WRITING FLASH...' : 'UPLOAD PAYLOAD'}</span>
              </button>

              <button
                onClick={handleConnectClick}
                disabled={isConnecting}
                className={`flex-1 h-10 font-mono text-xs font-bold tracking-wider rounded uppercase flex items-center justify-center gap-2 border shadow-[1px_1px_2px_rgba(0,0,0,0.05)] transition-all active:scale-95 ${
                  isConnected 
                    ? 'border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/20 text-red-600 hover:bg-red-100' 
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                    <span>HANDSHAKING...</span>
                  </>
                ) : isConnected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>DISCONNECT FTP</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>CONNECT FTP</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* DEVICE DETAILS ON THE RIGHT */}
        <section className="w-full xl:w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/25 border-b border-zinc-100 dark:border-zinc-805 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase">
                TARGET DEVICE INSTANCE
              </h3>
            </div>
          </div>

          <div className="p-5 space-y-4 font-mono text-[11px]">
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Device Name</span>
              <span className="text-zinc-950 dark:text-zinc-50 font-sans font-bold text-xs">
                {isConnected ? 'SGI-DBG-UNIT-A1' : '-'}
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Status Connection</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isConnected ? 'bg-emerald-500' : 'bg-zinc-300'
                }`} />
                <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                  {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Manufacturer</span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {isConnected ? 'SGI Systems Ltd.' : '-'}
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">IP ADDRESS</span>
              <span className="text-zinc-800 dark:text-zinc-200">
                {isConnected ? '192.168.1.105' : '-'}
              </span>
            </div>

            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">MAC ADDR</span>
              <span className="text-zinc-650 dark:text-zinc-400">
                {isConnected ? '00:1B:44:11:3A:B7' : '-'}
              </span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">FTP Status</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {isConnected ? 'ACTIVE' : 'IDLE'}
              </span>
            </div>
          </div>
        </section>

      </div>

      {/* BOTTOM LOG STREAM WINDOW WITH INTERACTIVE CONSOLE INTEGRATION */}
      <section className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg flex flex-col font-mono overflow-hidden shadow-sm min-h-[300px]">
        
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center p-4 border-b border-zinc-150 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-950/20">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-zinc-505" />
            <h3 className="text-xs font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase">
              INTERACTIVE SYSTEM LOG WINDOW
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 bg-white dark:bg-zinc-950 py-1 px-3 border border-zinc-200 dark:border-zinc-800 rounded text-[11px] font-bold text-zinc-500 uppercase cursor-pointer hover:border-zinc-950 dark:hover:border-zinc-200 transition-colors">
              <input type="checkbox" defaultChecked className="rounded border-zinc-300 text-zinc-900 focus:ring-0 w-3.5 h-3.5" />
              <span>SAVE LOG</span>
            </label>

            <button 
              onClick={() => { setLogs([]); alert("Console buffer cleaned."); }}
              className="flex items-center gap-1.5 py-1 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[11px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 transition-colors uppercase active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR LOG</span>
            </button>

            <button 
              onClick={() => alert("Simulating download. 'techsuite_logs.log' successfully downloaded.")}
              className="flex items-center gap-1.5 py-1 px-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded text-[11px] font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors uppercase active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT LOG</span>
            </button>
          </div>
        </div>

        {/* LOG TERMINAL VIEW */}
        <div className="flex-1 bg-zinc-950 text-zinc-100 p-4 font-mono text-xs overflow-y-auto space-y-1 w-full text-left min-h-[180px]">
          {logs.map((log, idx) => (
            <div 
              key={idx}
              className={
                log.startsWith('[INFO]') 
                  ? 'text-zinc-400' 
                  : log.startsWith('[WARN]')
                    ? 'text-amber-500'
                    : log.startsWith('[SUCCESS]')
                      ? 'text-emerald-400'
                      : log.startsWith('[ERROR]')
                        ? 'text-red-500'
                        : log.startsWith('//')
                          ? 'text-zinc-650 italic'
                          : 'text-zinc-200'
              }
            >
              {log}
            </div>
          ))}

          {/* Prompt line input */}
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 pt-1.5 text-zinc-200">
            <span className="text-emerald-400 font-bold">user@techsuite:~$</span>
            <input
              type="text"
              autoFocus
              className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none p-0 text-zinc-200 font-mono text-xs"
              placeholder='Type "help" to explore CLI commands...'
              value={cmdInput}
              onChange={(e) => setCmdInput(e.target.value)}
            />
          </form>

          <div ref={terminalEndRef} />
        </div>

      </section>

    </div>
  );
}
