export interface IEvent {
    event_name: String;
    event_description: String;
    time: Date;
    attendees: Array<String>;
    coord_lat: number;
    coord_lon: number;
    category: String;
}

export interface OEvent {
    event_id: String;
    event_name: String;
    event_description: String;
    time: Date;
    attendees: Array<String>;
    coord_lat: number;
    coord_lon: number;
    category: String;
}