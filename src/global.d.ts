declare global {
    // a vector interface
    interface Vector {
        x: number;
        y: number
    }

    // a mouse state interface
    interface MouseState {
        previous: Vector | null;
        current: Vector | null;
        pressed: boolean;
    }
}

export {}