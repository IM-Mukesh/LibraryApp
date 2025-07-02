import { AppVersion } from '../types';
import { VersionData } from '../types';
import DeviceInfo from 'react-native-device-info';

export const buildVersionData = (remote: AppVersion): VersionData => {
  return {
    currentVersion: DeviceInfo.getVersion(),
    latestVersion: remote.latestVersion,
    updateUrl: remote.updateUrl,
    releaseNotes: remote.releaseNotes,
    forceUpdate: remote.forceUpdate ?? false,
  };
};
