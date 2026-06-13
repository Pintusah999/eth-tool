/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TechSuiteTab {
  IP_SCANNER = 'IP Scanner',
  FTP_CONNECT = 'FTP Connect',
  HW_TESTING = 'HW Testing',
  DBG_TESTING = 'DBG Testing',
  MQTT_CONNECTION = 'MQTT Connection',
  FLASH_PROGRAMMER = 'Flash Programmer',
  CLAIM_WRITE = 'Claim Write'
}

export interface ScannedDevice {
  id: string;
  status: 'Online' | 'Offline' | 'Scanning...';
  ipAddress: string;
  name: string;
  ftp: 'Enabled' | 'Disabled';
  manufacturer: string;
  mac: string;
  services: string[];
}

export interface LogLine {
  timestamp: string;
  originIp: string;
  method: string;
  ch1: number;
  ch2: number;
  ch3: number;
  ch4: number;
  ch5: number;
  sigmaCurr: number;
  volt: number;
  temp: number;
}

export interface DeviceDetails {
  name: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'SCANNING';
  manufacturer: string;
  services: string;
  ipAddress: string;
  ftpStatus: string;
  macAddress: string;
}

export interface STLinkConfig {
  serialNumber: string;
  port: 'SWD' | 'JTAG';
  frequency: number;
  mode: 'Normal' | 'HotPlug' | 'UnderReset';
  lowPowerDebug: boolean;
}
