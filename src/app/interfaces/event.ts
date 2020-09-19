export interface IEvent {
    event_name: String;
    event_description: String;
    time: Date;
    attendees: Array<String>;
    coord_lat: number;
    coord_lon: number;
    category: string;
}