import React, { useState } from 'react';
import { Globe, User, Lock, Eye, EyeOff, Hash, Check, Power, RefreshCw, Radio } from 'lucide-react';

export default function MqttConnectionTab() {
  const [url, setUrl] = useState('broker.hivemq.com');
  const [username, setUsername] = useState('admin_user');
  const [password, setPassword] = useState('123456789');
  const [showPassword, setShowPassword] = useState(false);
  const [port, setPort] = useState('1883');
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [mqttLogs, setMqttLogs] = useState<string[]>([]);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (isConnected) {
      // Disconnect
      setIsConnected(false);
      setMqttLogs(prev => [...prev, '[INFO] Disconnected from MQTT broker manually.']);
      return;
    }

    setIsConnecting(true);
    setMqttLogs([
      `[INFO] Locating secure network route for: url=${url}, port=${port}...`,
      `[INFO] Starting socket binding with username: "${username}"...`
    ]);

    setTimeout(() => {
      setMqttLogs(prev => [...prev, '[INFO] TCP link established. Initiating MQTT CONNECT handshake...']);
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        setMqttLogs(prev => [
          ...prev,
          '[SUCCESS] Connection ACK received from broker.',
          '[SUBSCRIBE] Listening on system diagnostics topic: "sgi/devices/A1/metrics"',
          '[MQTT_LIVE] Active heartbeats broadcasting every 30s...'
        ]);
      }, 800);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 font-sans relative overflow-auto">
      
      {/* High tech grid ornament background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }}
      />

      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 p-8 rounded-lg shadow-sm text-center">
        
        {/* Title cluster */}
        <h2 className="text-xl font-bold font-sans tracking-tight text-zinc-950 dark:text-zinc-50 uppercase">
          MQTT Broker Configuration
        </h2>
        <p className="text-xs text-zinc-400 font-sans mt-1.5 mb-8">
          Configure and test connection parameters to the central MQTT broker.
        </p>

        {/* Form elements */}
        <form onSubmit={handleConnect} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          
          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase block">URL</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Globe className="w-4 h-4" />
              </span>
              <input
                type="text"
                className="w-full h-11 pl-10 pr-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:bg-white focus:outline-none focus:border-zinc-950 font-mono text-xs rounded text-zinc-800 dark:text-zinc-200"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="broker.hivemq.com"
                disabled={isConnecting || isConnected}
              />
            </div>
          </div>

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase block">Username</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                className="w-full h-11 pl-10 pr-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:bg-white focus:outline-none focus:border-zinc-950 font-mono text-xs rounded text-zinc-800 dark:text-zinc-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin_user"
                disabled={isConnecting || isConnected}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase block">Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full h-11 pl-10 pr-12 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:bg-white focus:outline-none focus:border-zinc-950 font-mono text-xs rounded text-zinc-800 dark:text-zinc-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isConnecting || isConnected}
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Port Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold font-mono tracking-widest text-zinc-400 uppercase block">Port</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                <Hash className="w-4 h-4" />
              </span>
              <input
                type="text"
                className="w-full h-11 pl-10 pr-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 focus:bg-white focus:outline-none focus:border-zinc-950 font-mono text-xs rounded text-zinc-800 dark:text-zinc-200"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="1883"
                disabled={isConnecting || isConnected}
              />
            </div>
          </div>

          {/* Button center control */}
          <div className="md:col-span-2 pt-6 flex justify-center">
            <button
              type="submit"
              disabled={isConnecting}
              className={`h-12 px-10 font-mono text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 rounded shadow transition-all active:scale-[0.98] ${
                isConnected
                  ? 'border border-red-200 bg-red-50 text-red-650 hover:bg-red-100'
                  : 'bg-zinc-950 dark:bg-zinc-50 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200'
              }`}
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>NEGOTIATING CONNECT HANDSHAKE...</span>
                </>
              ) : isConnected ? (
                <>
                  <Power className="w-4 h-4" />
                  <span>DISCONNECT FROM HOST</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>CONNECT TO MQTT BROKER</span>
                </>
              )}
            </button>
          </div>

        </form>

        {/* Live status log trace box */}
        {mqttLogs.length > 0 && (
          <div className="mt-8 p-4 bg-zinc-950 text-zinc-400 rounded text-left font-mono text-[11px] space-y-1 max-h-[140px] overflow-y-auto">
            {mqttLogs.map((log, i) => (
              <div key={i} className={log.startsWith('[SUCCESS]') ? 'text-emerald-400 font-bold' : ''}>
                {log}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Network Status Card at bottom right */}
      <div className="fixed bottom-12 right-6 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 p-4 rounded-lg shadow-sm font-mono text-xs text-left z-20">
        <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
          <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-zinc-500" />
            <span>LOCAL NETWORK METRICS</span>
          </h4>
        </div>
        <div className="space-y-2 text-[11px]">
          <div className="flex justify-between items-baseline">
            <span className="text-zinc-450 uppercase text-[9px] font-bold">GATEWAY CONNECTION</span>
            <span className="font-bold text-emerald-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>ONLINE</span>
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-zinc-450 uppercase text-[9px] font-bold">BROKER SOCKET STATE</span>
            <span className="font-sans font-bold text-zinc-800 dark:text-zinc-200">
              {isConnected ? 'LIVE CONNECT' : 'IDLE'}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-zinc-450 uppercase text-[9px] font-bold">PING LATENCY</span>
            <span className="font-bold text-zinc-600 dark:text-zinc-400">
              {isConnected ? '12ms' : '-'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
