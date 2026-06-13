import React, { useState } from 'react';
import { Award, ShieldCheck, Key, Cpu, HelpCircle, Edit3, CheckCircle } from 'lucide-react';

export default function ClaimWriteTab() {
  const [deviceSerial, setDeviceSerial] = useState('SGI-A1-2026-X883');
  const [modelType, setModelType] = useState('STM32F4-SECURE');
  const [orgTag, setOrgTag] = useState('AADVIK-TEK-LABS');
  
  const [publicKey, setPublicKey] = useState('-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAz7rCHb6f0eC1vSgD...\n-----END PUBLIC KEY-----');
  const [claimsSigned, setClaimsSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signatureHex, setSignatureHex] = useState('6A9EE3C4F81AA9003BFDCA84920E15CEB637B0AA48EFFCC021C78DFF73');

  const handleGenerateKeys = () => {
    const randomHex = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16).toUpperCase()
    ).join('');
    setSignatureHex(randomHex);
    setPublicKey(`-----BEGIN RSA PUBLIC KEY-----\nMIIBCgKCAQEAv${randomHex.substring(0, 20)}...\n-----END RSA PUBLIC KEY-----`);
    alert("Cryptographic signature keypairs regenerated successfully.");
  };

  const handleSignClaims = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setClaimsSigned(true);
      alert("Claims successfully signed and flashed onto target Node secure storage EEPROM.");
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col xl:flex-row gap-4 p-4 font-sans overflow-auto text-left">
      
      {/* Left panel */}
      <div className="flex-1 flex flex-col gap-4">
        
        {/* EEPROM WRITER & CLAIMS CARD */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-1.5 h-4 bg-zinc-950 dark:bg-zinc-50" />
            <h2 className="text-xs font-bold font-mono tracking-widest text-zinc-900 dark:text-zinc-100 uppercase">
              EEPROM CLAIM WRITER & IDENTITY CONFIG
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-[11px]">
            {/* Device Serial */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">DEVICES UNIQUE SERIAL</label>
              <input
                type="text"
                className="w-full h-10 px-3.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono rounded text-zinc-850 dark:text-zinc-200"
                value={deviceSerial}
                onChange={(e) => setDeviceSerial(e.target.value)}
                placeholder="SGI-A1-2026-X883"
              />
            </div>

            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">DEVICE ARCH MODEL</label>
              <select
                className="w-full h-10 px-3 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono rounded"
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
              >
                <option value="STM32F4-SECURE">STM32F4 Core Secure</option>
                <option value="PLC-S7-HIGHLEVEL">Siemens PLC S7 Mode</option>
                <option value="SGI-DBG-STANDALONE">SGI Probe Node Standalone</option>
              </select>
            </div>

            {/* Manufacturer organization tag */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">ORGANIZATION TAG</label>
              <input
                type="text"
                className="w-full h-10 px-3.5 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-mono rounded text-zinc-850 dark:text-zinc-200"
                value={orgTag}
                onChange={(e) => setOrgTag(e.target.value)}
                placeholder="AADVIK-TEK-LABS"
              />
            </div>
          </div>

          {/* Cryptographic PEM parameters */}
          <div className="mt-5 space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 font-mono text-[11px]">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">PEM ENCODED PUBLIC KEY STRUCT</label>
              <textarea 
                rows={3}
                className="w-full p-3 border border-zinc-200 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-950 rounded text-[11px] font-mono select-all focus:outline-none"
                value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">HEX CLAIMS DIGITAL SIGNATURE</label>
              <input 
                type="text"
                className="w-full h-9 px-3 border border-zinc-200 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-950 rounded text-xs font-mono select-all"
                value={signatureHex}
                onChange={(e) => setSignatureHex(e.target.value)}
              />
            </div>
          </div>

          {/* Key actions */}
          <div className="flex gap-3 pt-5 mt-3 border-t border-zinc-100 dark:border-zinc-800/50">
            <button
              onClick={handleGenerateKeys}
              className="flex-1 h-10 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-950 dark:hover:border-zinc-20 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-xs font-bold uppercase rounded tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Key className="w-4 h-4" />
              <span>GENERATE KEYPAIRS</span>
            </button>

            <button
              onClick={handleSignClaims}
              disabled={isSigning}
              className="flex-1 h-10 bg-zinc-950 dark:bg-zinc-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-mono text-xs font-bold uppercase rounded tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              <Award className="w-4 h-4" />
              <span>{isSigning ? 'CRYPTOMODULE BUSY...' : 'SIGN & FLASH CLAIMS'}</span>
            </button>
          </div>
        </section>

      </div>

      {/* Right Column details */}
      <aside className="w-full xl:w-96 shrink-0 flex flex-col gap-4">
        
        {/* SECURE CARD ID DESIGN PREVIEW */}
        <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-805 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-950/25 border-b border-zinc-100 dark:border-zinc-805 flex items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
              <ShieldCheck className="w-3.5 h-3.5" />
              <h3 className="text-[10px] font-bold font-mono tracking-widest uppercase">
                EMBEDDED DIGITAL ID TOKEN
              </h3>
            </div>
          </div>

          <div className="p-5">
            {/* Hologram card effect */}
            <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white p-5 rounded-lg border border-zinc-800 shadow-md font-mono text-[10px] relative overflow-hidden select-none">
              {/* Absolute background matrix overlay */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-zinc-805/10 to-transparent rounded-full filter blur-md" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-[9px] font-bold uppercase text-zinc-400">Claims Credential Token</h4>
                  <p className="text-xs font-bold font-sans tracking-wide text-white mt-0.5">{modelType}</p>
                </div>
                <Cpu className="w-7 h-7 text-zinc-500" />
              </div>

              <div className="space-y-2 border-t border-zinc-800 pt-3.5">
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">UNIQUE ID</span>
                  <span className="font-bold text-zinc-200">{deviceSerial}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">CRYPTO ENGINE</span>
                  <span className="font-bold text-zinc-200">SHA256-RSA-2048</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">TENANT KEY</span>
                  <span className="font-bold text-zinc-200 truncate max-w-[120px]">{orgTag}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-zinc-550 uppercase">DIGITAL ACCREDITED</span>
                  {claimsSigned ? (
                    <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold uppercase tracking-tight rounded border border-emerald-900/30 flex items-center gap-1 text-[9px]">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>SECURE FLASHER</span>
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 bg-zinc-850 text-zinc-500 font-bold uppercase tracking-tight rounded text-[9px]">
                      PENDING GENERATE
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-805 rounded text-left text-zinc-500 text-[11px] leading-relaxed">
              Generate secure elements credentials claims for your manufactured IoT device units, flash the cryptographically signed certificates directly into memory bank sectors, to prevent unauthorized reverse engineering.
            </div>
          </div>
        </section>

      </aside>

    </div>
  );
}
