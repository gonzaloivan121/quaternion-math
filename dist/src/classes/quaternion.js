"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quaternion = void 0;
const vector_math_1 = require("@xloxlolex/vector-math");
class Quaternion {
    /**
     * Creates a new Quaternion with given x, y, z and w components.
     * @param x X component of the Quaternion.
     * @param y Y component of the Quaternion.
     * @param z Z component of the Quaternion.
     * @param w W component of the Quaternion.
     */
    constructor(x, y, z, w) {
        /**
         * X component of the Quaternion.
         */
        this.x = 0;
        /**
         * Y component of the Quaternion.
         */
        this.y = 0;
        /**
         * Z component of the Quaternion.
         */
        this.z = 0;
        /**
         * W component of the Quaternion.
         */
        this.w = 1;
        if (x)
            this.x = x;
        if (y)
            this.y = y;
        if (z)
            this.z = z;
        if (w)
            this.w = w;
    }
    /**
     * Shorthand for writing Quaternion(0, 0, 0, 1).
     */
    static get identity() {
        return new Quaternion(0, 0, 0, 1);
    }
    /**
     * Returns this Quaternion with a magnitude of 1 (Read Only).
     */
    get normalized() {
        const mag = this.magnitude;
        if (mag > 0) {
            return new Quaternion(this.x / mag, this.y / mag, this.z / mag, this.w / mag);
        }
        return Quaternion.identity;
    }
    /**
     * Returns the length of this Quaternion.
     */
    get magnitude() {
        return Math.sqrt(Quaternion.Dot(this, this));
    }
    /**
     * Returns the squared length of this Quaternion.
     */
    get sqrMagnitude() {
        return Math.sqrt(this.magnitude);
    }
    /**
     * Returns the conjugate of this Quaternion.
     */
    get conjugate() {
        return new Quaternion(-this.x, -this.y, -this.z, this.w);
    }
    /**
     * Returns the inverse of this Quaternion.
     */
    get inverse() {
        let conj = this.conjugate;
        let mag2 = this.magnitude ** 2;
        return new Quaternion(conj.x / mag2, conj.y / mag2, conj.z / mag2, conj.w / mag2);
    }
    /**
     * Euler angles representation of this Quaternion.
     */
    get eulerAngles() {
        let t0 = 2 * (this.w * this.x + this.y * this.z);
        let t1 = 1 - 2 * (this.x * this.x + this.y * this.y);
        let z = Math.atan2(t0, t1);
        let t2 = 2 * (this.w * this.y - this.z * this.x);
        t2 = t2 > 1 ? t2 + 1 : t2;
        t2 = t2 < -1 ? t2 - 1 : t2;
        let y = Math.asin(t2);
        let t3 = 2 * (this.w * this.z + this.x * this.y);
        let t4 = 1 - 2 * (this.y * this.y + this.z * this.z);
        let x = Math.atan2(t3, t4);
        return new vector_math_1.Vector3(x, y, z);
    }
    /**
     * Create a Quaternion from Euler angles.
     * @param v Euler angles Vector3.
     * @returns The Quaternion created from Euler angles.
     */
    static Euler(v) {
        return new Quaternion(Math.sin(v.z / 2) * Math.cos(v.y / 2) * Math.cos(v.x / 2) - Math.cos(v.z / 2) * Math.sin(v.y / 2) * Math.sin(v.x / 2), Math.cos(v.z / 2) * Math.sin(v.y / 2) * Math.cos(v.x / 2) + Math.sin(v.z / 2) * Math.cos(v.y / 2) * Math.sin(v.x / 2), Math.cos(v.z / 2) * Math.cos(v.y / 2) * Math.sin(v.x / 2) - Math.sin(v.z / 2) * Math.sin(v.y / 2) * Math.cos(v.x / 2), Math.cos(v.z / 2) * Math.cos(v.y / 2) * Math.cos(v.x / 2) + Math.sin(v.z / 2) * Math.sin(v.y / 2) * Math.sin(v.x / 2));
    }
    /**
     * Normalizes a Quaternion.
     * @param q Quaternion to normalize.
     * @returns The normalized Quaternion.
     */
    static Normalize(q) {
        return q.normalized;
    }
    /**
     * Returns the angle in degrees from one Quaternion to another.
     * @param from Start rotation.
     * @param to End rotation.
     * @returns The angle in degrees.
     */
    static Angle(from, to) {
        const dot = Quaternion.Dot(from, to);
        const magFrom = from.magnitude;
        const magTo = to.magnitude;
        const RAD = 180 / Math.PI;
        return Math.acos(dot / (magFrom * magTo)) * RAD;
    }
    /**
     * Returns a copy of a Quaternion with its magnitude clamped to maxLength.
     * @param quaternion Quaternion to clamp.
     * @param maxLength length to clamp to.
     * @returns Quaternion with its magnitude clamped.
     */
    static ClampMagnitude(quaternion, maxLength) {
        const mag = quaternion.magnitude;
        let multiplier = 1;
        if (mag > maxLength) {
            multiplier = maxLength / mag;
        }
        return new Quaternion(quaternion.x * multiplier, quaternion.y * multiplier, quaternion.z * multiplier, quaternion.w * multiplier);
    }
    /**
     * Rotates a Quaternion towards another with a max degree of maxDegreesDelta.
     * @param from Start value.
     * @param to End value.
     * @param maxDegreesDelta The maximum degrees that the rotation have.
     * @returns The rotated Quaternion.
     */
    static RotateTowards(from, to, maxDegreesDelta) {
        let angle = this.Angle(from, to);
        if (angle === 0)
            return to;
        return this.SlerpUnclamped(from, to, Math.min(1, maxDegreesDelta / angle));
    }
    /**
     * Spherical Linear Interpolation between two Quaternions. If t is lower than 0, return a. If t is greater than 1, return b.
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Interpolated value, equals to (b * one.inverse)**t * one.
     */
    static Slerp(from, to, t) {
        if (t < 0)
            return from;
        if (t > 1)
            return to;
        return Quaternion.DoSlerp(from, to, t);
    }
    /**
     * Spherical Linear Interpolation between two Quaternions.
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Spherical Linear Interpolated value between two Quaternions by t.
     */
    static DoSlerp(from, to, t) {
        // Compute the dot product (cosine of the angle)
        let dot = this.Dot(from, to);
        // If the dot product is negative, slerp won't take the shorter path
        // So we invert one quaternion to take the shorter path
        if (dot < 0) {
            to = new Quaternion(-to.x, -to.y, -to.z, -to.w);
            dot = -dot;
        }
        const DOT_THRESHOLD = 0.9995;
        if (dot > DOT_THRESHOLD) {
            // If the quaternions are very close, we use linear interpolation
            const result = new Quaternion(from.x + t * (to.x - from.x), from.y + t * (to.y - from.y), from.z + t * (to.z - from.z), from.w + t * (to.w - from.w));
            return result.normalized;
        }
        // Calculate the angle between the quaternions
        const theta_0 = Math.acos(dot);
        const theta = theta_0 * t;
        // Compute the second quaternion orthogonal to the Quaternion "to"
        const to_orthogonal = new Quaternion(to.x - from.x * dot, to.y - from.y * dot, to.z - from.z * dot, to.w - from.w * dot).normalized;
        // Calculate the interpolated quaternion
        return new Quaternion(from.x * Math.cos(theta) + to_orthogonal.x * Math.sin(theta), from.y * Math.cos(theta) + to_orthogonal.y * Math.sin(theta), from.z * Math.cos(theta) + to_orthogonal.z * Math.sin(theta), from.w * Math.cos(theta) + to_orthogonal.w * Math.sin(theta));
    }
    /**
     * Spherical Linear Interpolation between two Quaternions.
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Interpolated value, equals to a + (b - a) * t.
     */
    static SlerpUnclamped(from, to, t) {
        return Quaternion.DoSlerp(from, to, t);
    }
    /**
     * Rotates a point with a given rotation.
     * @param rotation The rotation to rotate the point with.
     * @param point The point to rotate with the rotation.
     * @returns The rotated point.
     */
    static RotatePoint(rotation, point) {
        let x = rotation.x * 2;
        let y = rotation.y * 2;
        let z = rotation.z * 2;
        let xx = rotation.x * x;
        let yy = rotation.y * y;
        let zz = rotation.z * z;
        let xy = rotation.x * y;
        let xz = rotation.x * z;
        let yz = rotation.y * z;
        let wx = rotation.w * x;
        let wy = rotation.w * y;
        let wz = rotation.w * z;
        let res = new vector_math_1.Vector3((1 - (yy + zz)) * point.x + (xy - wz) * point.y + (xz + wy) * point.z, (xy + wz) * point.x + (1 - (xx + zz)) * point.y + (yz - wx) * point.z, (xz - wy) * point.x + (yz + wx) * point.y + (1 - (xx + yy)) * point.z);
        return res;
    }
    /**
     * The dot product between two Quaternions.
     * @param a First Quaternion.
     * @param b Second Quaternion.
     * @returns The result of the dot product between two Quaternions.
     */
    static Dot(lhs, rhs) {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z + lhs.w * rhs.w;
    }
    /**
     * Returns the length of a given Quaternion
     * @param quaternion The Quaternion to calculate its magnitude
     * @returns The magnitude of the given Quaternion.
     */
    static Magnitude(quaternion) {
        return quaternion.magnitude;
    }
    /**
     * Add two Quaternions.
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns The result of the addition between the two Quaternions.
     */
    static Add(lhs, rhs) {
        return new Quaternion(lhs.x + rhs.x, lhs.y + rhs.y, lhs.z + rhs.z, lhs.w + rhs.w);
    }
    /**
     * Subtract two Quaternions.
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns The result of the subtraction between the two Quaternions.
     */
    static Subtract(lhs, rhs) {
        return new Quaternion(lhs.x - rhs.x, lhs.y - rhs.y, lhs.z - rhs.z, lhs.w - rhs.w);
    }
    /**
     * Combines rotations lhs and rhs.
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns The combined Quaternion between lhs and rhs.
     */
    static Multiply(lhs, rhs) {
        return new Quaternion(lhs.w * rhs.x + lhs.x * rhs.w + lhs.y * rhs.z - lhs.z * rhs.y, lhs.w * rhs.y + lhs.y * rhs.w + lhs.z * rhs.x - lhs.x * rhs.z, lhs.w * rhs.z + lhs.z * rhs.w + lhs.x * rhs.y - lhs.y * rhs.x, lhs.w * rhs.w - lhs.x * rhs.x - lhs.y * rhs.y - lhs.z * rhs.z);
    }
    /**
     * Divides two Quaternions (lhs / rhs).
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns The quotient of the division between the two Quaternions
     */
    static Divide(lhs, rhs) {
        const inverseRhs = rhs.inverse;
        return Quaternion.Multiply(lhs, inverseRhs);
    }
    /**
     * Checks whether the lhs and the rhs Quaternions are the same.
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns Whether or not the two Quaternions are the same.
     */
    static Equals(lhs, rhs) {
        return (lhs.x === rhs.x &&
            lhs.y === rhs.y &&
            lhs.z === rhs.z &&
            lhs.w === rhs.w);
    }
    /**
     * Add a Quaternion to this Quaternion.
     * @param other The Quaternion to add to this Quaternion.
     */
    Add(other) {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        this.w += other.w;
    }
    /**
     * Subtract a Quaternion from this Quaternion
     * @param other The Quaternion to subtract from this Quaternion.
     */
    Subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        this.w -= other.w;
    }
    /**
     * Combines rotations between this Quaternion and another.
     * @param other Quaternion to combine with this Quaternion.
     */
    Multiply(other) {
        this.x = this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y;
        this.y = this.w * other.y + this.y * other.w + this.z * other.x - this.x * other.z;
        this.z = this.w * other.z + this.z * other.w + this.x * other.y - this.y * other.x;
        this.w = this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z;
    }
    /**
     * Divides two Quaternions (this / other).
     * @param other Second Quaternion.
     */
    Divide(other) {
        const inverseOther = other.inverse;
        this.Multiply(inverseOther);
    }
    /**
     * Checks whether this Quaternion and another are the same.
     * @param other Other Quaternion to check if it's the same with this Quaternion.
     * @returns Whether or not the two Quaternions are the same.
     */
    Equals(other) {
        return (this.x === other.x &&
            this.y === other.y &&
            this.z === other.z &&
            this.w === other.w);
    }
}
exports.Quaternion = Quaternion;
