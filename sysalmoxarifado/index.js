import { registerRootComponent } from 'expo';
import App from './App';

// Esse comando força o Expo a registrar o seu App.js como a raiz do projeto, tanto para Mobile quanto para Web
registerRootComponent(App);