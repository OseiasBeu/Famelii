import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureCheckInStorage, configureFinanceStorage } from "@nucleo/core";

const adapter = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
};

configureCheckInStorage(adapter);
configureFinanceStorage(adapter);
