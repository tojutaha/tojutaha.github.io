export const v2 = {
    x: 0,
    y: 0,

    add: function(other) {
        this.x += other.x;
        this.y += other.y;
    },

    subtract: function(other) {
        this.x -= other.x;
        this.y -= other.y;
    },

    multiplyV2: function(other) {
        this.x *= other.x;
        this.y *= other.y;
    },

    multiplyS: function(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    },

    isEqual: function(other) {
        return this.x === other.x &&
               this.y === other.y;
    }
}

export const v3 = {
    x: 0,
    y: 0,
    z: 0,
}