/**
 * Ambient declarations for non-code imports.
 *
 * Webpack/Turbopack resolve these at build time, but TypeScript 6 will not
 * accept a side-effect import of a stylesheet without a declaration for it.
 */
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
