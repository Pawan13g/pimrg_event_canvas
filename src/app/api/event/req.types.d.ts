export type POST = {
    eventName: string
    eventAuthority: "fest" | "club"
    eventDescription: string
    eventDisplayImageURL: string
    eventFrom: Date
    eventTo: Date
    eventStartTime: Date
    eventEndTime: Date
}
