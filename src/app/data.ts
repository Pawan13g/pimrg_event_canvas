export interface Album {
    name: string
    artist: string
    cover: string
}

export type Playlist = (typeof playlists)[number]

export const listenNowAlbums: Album[] = [
    {
        name: "React Rendezvous",
        artist: "Ethan Byte",
        cover:
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    },
    {
        name: "Async Awakenings",
        artist: "Nina Netcode",
        cover:
            "https://images.unsplash.com/photo-1530202741-e752bdc9d582?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
        name: "The Art of Reusability",
        artist: "Lena Logic",
        cover:
            "https://images.unsplash.com/photo-1561489396-888724a1543d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1070&q=80",
    },
    {
        name: "Stateful Symphony",
        artist: "Beth Binary",
        cover:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
]

export const madeForYouAlbums: Album[] = [
    {
        name: "Thinking Components",
        artist: "Lena Logic",
        cover:
            "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
    },
    {
        name: "Functional Fury",
        artist: "Beth Binary",
        cover:
            "https://images.unsplash.com/photo-1513745405825-efaf9a49315f?w=300&dpr=2&q=80",
    },
    {
        name: "React Rendezvous",
        artist: "Ethan Byte",
        cover:
            "https://images.unsplash.com/photo-1614113489855-66422ad300a4?w=300&dpr=2&q=80",
    },
    {
        name: "Stateful Symphony",
        artist: "Beth Binary",
        cover:
            "https://images.unsplash.com/photo-1446185250204-f94591f7d702?w=300&dpr=2&q=80",
    },
    {
        name: "Async Awakenings",
        artist: "Nina Netcode",
        cover:
            "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
    },
    {
        name: "The Art of Reusability",
        artist: "Lena Logic",
        cover:
            "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
    },
]

export const playlists = [
    "Recently Added",
    "Recently Played",
    "Top Songs",
    "Top Albums",
    "Top Artists",
    "Logic Discography",
    "Bedtime Beats",
    "Feeling Happy",
    "I miss Y2K Pop",
    "Runtober",
    "Mellow Days",
    "Eminem Essentials",
]