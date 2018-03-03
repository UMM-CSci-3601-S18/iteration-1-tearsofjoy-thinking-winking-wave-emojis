export interface Emoji {
    _id: string;
    ownerID: string;
    emoji: number;
    rating: number;
    // mongo should let us store the date in the form <YYYY-mm-ddTHH:MM:ss> as a string
    // for example: "2016-05-18T16:00:00Z" for 4:00pm on the 18th of May 2016
    Date: string;
    Description: string;
}
