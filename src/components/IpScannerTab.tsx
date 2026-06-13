import React, { useState, useEffect } from 'react';
import { Play, Shield, RefreshCw } from 'lucide-react';
import { ScannedDevice, DeviceDetails } from '../types';

interface IpScannerTabProps {
  searchQuery: string;
}

export default function IpScannerTab({ searchQuery }: IpScannerTabProps) {
  const [networkBase, setNetworkBase] = useState('192.168.1.');
  const [toIp, setToIp] = useState('254');
  const [macFilter, setMacFilter] = useState('8C-1F-64-C4');
  const [progress, setProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<ScannedDevice | null>(null);

  // Hardcoded initial list of pre-configured network devices
  const [devices, setDevices] = useState<ScannedDevice[]>([
    {
      id: 'dev_1',
      status: 'Online',
      ipAddress: '192.168.1.1',
      name: 'Gateway_Primary',
      ftp: 'Enabled',
      manufacturer: 'Cisco Systems',
      mac: '8C:1F:64:C4:00:01',
      services: ['HTTP', 'SSH', 'SNMP']
    },
    {
      id: 'dev_2',
      status: 'Offline',
      ipAddress: '192.168.1.12',
      name: 'WS-OPERATOR-01',
      ftp: 'Disabled',
      manufacturer: 'Dell Inc.',
      mac: 'A2:44:B1:00:32:0C',
      services: ['-']
    }
  ]);

  // Handle fake scan simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isScanning) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsScanning(false);
            clearInterval(timer);
            return 100;
          }
          // Dynamically add a simulated scanned device at specific intervals
          if (prev === 25) {
            setDevices(prevList => [
              ...prevList,
              {
                id: 'dev_3',
                status: 'Online',
                ipAddress: '192.168.1.105',
                name: 'SGI-DBG-UNIT-A1',
                ftp: 'Enabled',
                manufacturer: 'SGI Systems Ltd.',
                mac: '00:1B:44:11:3A:B7',
                services: ['UDP', 'FTP', 'RT-STREAM']
              }
            ]);
          }
          if (prev === 60) {
            setDevices(prevList => [
              ...prevList,
              {
                id: 'dev_4',
                status: 'Online',
                ipAddress: '192.168.1.18',
                name: 'PLC-PUMP-ROOM',
                ftp: 'Disabled',
                manufacturer: 'Siemens AG',
                mac: 'E4:90:69:BC:21:40',
                services: ['MODBUS', 'HTTP']
              }
            ]);
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(timer);
  }, [isScanning]);

  const handleStartScan = () => {
    setIsScanning(true);
    setProgress(0);
    // Reset all generated devices except the base 2
    setDevices([
      {
        id: 'dev_1',
        status: 'Online',
        ipAddress: '192.168.1.1',
        name: 'Gateway_Primary',
        ftp: 'Enabled',
        manufacturer: 'Cisco Systems',
        mac: '8C:1F:64:C4:00:01',
        services: ['HTTP', 'SSH', 'SNMP']
      },
      {
        id: 'dev_2',
        status: 'Offline',
        ipAddress: '192.168.1.12',
        name: 'WS-OPERATOR-01',
        ftp: 'Disabled',
        manufacturer: 'Dell Inc.',
        mac: 'A2:44:B1:00:32:0C',
        services: ['-']
      }
    ]);
    setSelectedDevice(null);
  };

  // Filter devices by system filter search query
  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.ipAddress.includes(searchQuery) ||
    device.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.mac.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-4 p-4 font-sans overflow-auto">
      
      {/* Left panel space */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* CONFIGURATION SCAN PANEL */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-1.5 h-4 bg-zinc-950 dark:bg-zinc-50" />
            <h2 className="text-xs font-bold tracking-wider font-mono text-zinc-900 dark:text-zinc-100 uppercase">
              SCAN CONFIGURATION
            </h2>
          </div>

          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              
              {/* Network Base */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                  NETWORK BASE
                </label>
                <input
                  type="text"
                  className="w-full h-10 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 font-mono text-xs rounded text-zinc-800 dark:text-zinc-200"
                  value={networkBase}
                  onChange={(e) => setNetworkBase(e.target.value)}
                  placeholder="192.168.1."
                  disabled={isScanning}
                />
              </div>

              {/* To Limit */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                  TO RANGE LIMIT
                </label>
                <input
                  type="text"
                  className="w-full h-10 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 font-mono text-xs rounded text-zinc-800 dark:text-zinc-200"
                  value={toIp}
                  onChange={(e) => setToIp(e.target.value)}
                  placeholder="254"
                  disabled={isScanning}
                />
              </div>

              {/* MAC Filter */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                  MAC STRING FILTER
                </label>
                <input
                  type="text"
                  className="w-full h-10 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 font-mono text-xs rounded text-zinc-800 dark:text-zinc-200"
                  value={macFilter}
                  onChange={(e) => setMacFilter(e.target.value)}
                  placeholder="8C-1F-64-C4"
                  disabled={isScanning}
                />
              </div>

            </div>

            {/* Submit Action Button */}
            <button
              onClick={handleStartScan}
              disabled={isScanning}
              className="h-10 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all text-white dark:text-zinc-950 px-6 font-mono text-xs font-bold tracking-wider rounded uppercase flex items-center justify-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] disabled:opacity-50 active:scale-95 shrink-0"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>RUNNING SCAN...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>START SCAN</span>
                </>
              )}
            </button>
          </div>

          {/* Progress bar and statistics updates */}
          <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold font-mono tracking-wider text-zinc-400 uppercase">
                {isScanning ? 'SCAN PROGRESS IN PROCESS' : 'SCANNER SYSTEM IDLE'}
              </span>
              <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {progress}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-950 dark:bg-zinc-100 transition-all duration-150 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {/* DETAILS TABLE RESULTS */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg flex-1 overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-805 bg-zinc-50/50 dark:bg-zinc-900 text-left">
            <h3 className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase font-mono">
              SCANNED NODE DEVICES LIST
            </h3>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/25 select-none text-[10px] font-bold tracking-widest text-zinc-400 font-mono">
                  <th className="px-5 py-3">STATUS</th>
                  <th className="px-5 py-3">IP ADDRESS</th>
                  <th className="px-5 py-3">HOST NAME</th>
                  <th className="px-5 py-3">FTP STATUS</th>
                  <th className="px-5 py-3">MANUFACTURER</th>
                  <th className="px-5 py-3">MAC HARDWARE</th>
                  <th className="px-5 py-3">ACTIVE SERVICES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                {filteredDevices.map((device) => {
                  const isSelected = selectedDevice?.id === device.id;
                  return (
                    <tr
                      key={device.id}
                      onClick={() => setSelectedDevice(device)}
                      className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors ${
                        isSelected ? 'bg-zinc-100/70 dark:bg-zinc-800' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          device.status === 'Online' ? 'bg-emerald-500' : 'bg-zinc-300'
                        }`} />
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{device.status}</span>
                      </td>
                      <td className="px-5 py-3.5 tracking-tight">{device.ipAddress}</td>
                      <td className="px-5 py-3.5 font-bold text-zinc-800 dark:text-zinc-200">{device.name}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${
                          device.ftp === 'Enabled' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200/50 dark:border-emerald-900/30' 
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                        }`}>
                          {device.ftp}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">{device.manufacturer}</td>
                      <td className="px-5 py-3.5 text-zinc-500">{device.mac}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1 flex-wrap">
                          {device.services.map((srv, idx) => (
                            <span 
                              key={idx} 
                              className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] rounded"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Right Column: DEVICE DETAILS Widget panel with modern aesthetics */}
      <aside className="w-full xl:w-80 shrink-0 flex flex-col gap-4">
        
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/25 border-b border-zinc-100 dark:border-zinc-805 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
              <Shield className="w-3.5 h-3.5 text-zinc-500" />
              <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase">
                SELECTED DEVICE DETAILS
              </h3>
            </div>
          </div>

          <div className="p-5 space-y-4 font-mono text-[11px]">
            {/* NAME */}
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Device Name</span>
              <span className="text-zinc-950 dark:text-zinc-50 font-sans font-bold text-xs">
                {selectedDevice ? selectedDevice.name : '-'}
              </span>
            </div>

            {/* STATUS */}
            <div className="flex justify-between items-center border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Status Connection</span>
              {selectedDevice ? (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    selectedDevice.status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 uppercase">
                    {selectedDevice.status === 'Online' ? 'CONNECTED' : 'OFFLINE'}
                  </span>
                </div>
              ) : (
                <span className="text-zinc-500">-</span>
              )}
            </div>

            {/* MANUFACTURER */}
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Manufacturer</span>
              <span className="text-zinc-700 dark:text-zinc-300">
                {selectedDevice ? selectedDevice.manufacturer : '-'}
              </span>
            </div>

            {/* IP ADDRESS */}
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">IP ADDRESS</span>
              <span className="text-zinc-800 dark:text-zinc-200 font-bold">
                {selectedDevice ? selectedDevice.ipAddress : '-'}
              </span>
            </div>

            {/* MAC ADDRESS */}
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">MAC ADDR</span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {selectedDevice ? selectedDevice.mac : '-'}
              </span>
            </div>

            {/* SERVICES */}
            <div className="flex justify-between items-baseline border-b border-dashed border-zinc-100 dark:border-zinc-800 pb-2">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Services List</span>
              <span className="text-zinc-800 dark:text-zinc-200 truncate">
                {selectedDevice ? selectedDevice.services.join(', ') : '-'}
              </span>
            </div>

            {/* FTP STATUS */}
            <div className="flex justify-between items-baseline pb-1">
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">FTP Status</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {selectedDevice ? selectedDevice.ftp : '-'}
              </span>
            </div>
          </div>
        </section>

        {/* Informative system guide box */}
        <section className="bg-zinc-50 dark:bg-zinc-950 p-5 rounded-lg border border-zinc-200 dark:border-zinc-805 text-left font-sans space-y-2">
          <h4 className="text-[10px] font-bold text-zinc-800 dark:text-zinc-100 font-mono tracking-wider uppercase">
            OPERATIONAL NOTES
          </h4>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Configure target base subnet to explore connected embedded node hosts. Filter list using device MAC filter keywords. Enable active diagnostic communication sockets for debugger test sequences.
          </p>
        </section>

      </aside>

    </div>
  );
}
