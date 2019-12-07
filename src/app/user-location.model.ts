export class UserLocation {
  constructor (
    public abbreviation: string,
    public countryName: string,
    public formatted: Date,
    public status: string,
    public timestamp: number,
    public message: string,
    public zoneName: string
  ) {}
}
