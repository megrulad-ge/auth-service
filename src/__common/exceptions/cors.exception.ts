export class CorsException extends Error {
  constructor(message) {
    super(message);

    this.name = 'CorsException';
  }
}
