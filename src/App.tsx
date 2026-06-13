import React, { useState } from 'react';
import { TechSuiteTab } from './types';
import SignInScreen from './components/SignInScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import IpScannerTab from './components/IpScannerTab';
import FtpConnectTab from './components/FtpConnectTab';
import HwTestingTab from './components/HwTestingTab';
import DbgTestingTab from './components/DbgTestingTab';
import MqttConnectionTab from './components/MqttConnectionTab';
import FlashProgrammerTab from './components/FlashProgrammerTab';
import ClaimWriteTab from './components/ClaimWriteTab';

export default function App() {
  const [operator, setOperator] = useState<{ email: string; id: string } | null>({
    email: 'admin@aadvik-tek.labs',
    id: 'OPS-8821'
  }); // Default signed in for smooth out of box preview, custom sign out supported.
  
  const [activeTab, setActiveTab] = useState<TechSuiteTab>(TechSuiteTab.IP_SCANNER);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSignIn = (email: string, id: string) => {
    setOperator({ email, id });
  };

  const handleSignOut = () => {
    setOperator(null);
  };

  if (!operator) {
    return <SignInScreen onSignIn={handleSignIn} />;
  }

  // Render correct content pane matching designated tab selection
  const renderTabContent = () => {
    switch (activeTab) {
      case TechSuiteTab.IP_SCANNER:
        return <IpScannerTab searchQuery={searchQuery} />;
      case TechSuiteTab.FTP_CONNECT:
        return <FtpConnectTab />;
      case TechSuiteTab.HW_TESTING:
        return <HwTestingTab />;
      case TechSuiteTab.DBG_TESTING:
        return <DbgTestingTab />;
      case TechSuiteTab.MQTT_CONNECTION:
        return <MqttConnectionTab />;
      case TechSuiteTab.FLASH_PROGRAMMER:
        return <FlashProgrammerTab />;
      case TechSuiteTab.CLAIM_WRITE:
        return <ClaimWriteTab />;
      default:
        return <IpScannerTab searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden font-sans">
      {/* Sidebar container */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        operatorName={operator.email}
        onSignOut={handleSignOut}
      />

      {/* Main page content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          systemReady={true}
          onSignOut={handleSignOut}
          operatorName={operator.email}
          operatorId={operator.id}
        />

        {/* Dynamic content pane */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-900/10 flex flex-col">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
