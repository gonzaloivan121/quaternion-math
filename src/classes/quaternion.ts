import { Vector3 } from "@xloxlolex/vector-math";
import { IQuaternion } from "../interfaces";

export class Quaternion implements IQuaternion {
    /**
     * X component of the Quaternion.
     */
    public x: number = 0;
    /**
     * Y component of the Quaternion.
     */
    public y: number = 0;
    /**
     * Z component of the Quaternion.
     */
    public z: number = 0;
    /**
     * W component of the Quaternion.
     */
    public w: number = 1;

    /**
     * Creates a new Quaternion with given x, y, z and w components.
     * @param x X component of the Quaternion.
     * @param y Y component of the Quaternion.
     * @param z Z component of the Quaternion.
     * @param w W component of the Quaternion.
     */
    constructor(x?: number, y?: number, z?: number, w?: number) {
        if (x) this.x = x;
        if (y) this.y = y;
        if (z) this.z = z;
        if (w) this.w = w;
    }

    /**
     * Shorthand for writing Quaternion(0, 0, 0, 1).
     */
    public static get identity(): Quaternion {
        return new Quaternion(0, 0, 0, 1);
    }

    /**
     * Returns this Quaternion with a magnitude of 1 (Read Only).
     */
    public get normalized(): Quaternion {
        const mag = this.magnitude;

        if (mag > 0) {
            return new Quaternion(
                this.x / mag,
                this.y / mag,
                this.z / mag,
                this.w / mag
            );
        }

        return Quaternion.identity;
    }

    /**
     * Returns the length of this Quaternion.
     */
    public get magnitude(): number {
        return Math.sqrt(Quaternion.Dot(this, this));
    }

    /**
     * Returns the squared length of this Quaternion.
     */
    public get sqrMagnitude(): number {
        return Math.sqrt(this.magnitude);
    }

    /**
     * Returns the conjugate of this Quaternion.
     */
    public get conjugate(): Quaternion {
        return new Quaternion(this.x, -this.y, -this.z, -this.w);
    }

    /**
     * Returns the inverse of this Quaternion.
     */
    public get inverse(): Quaternion {
        let conj: Quaternion = this.conjugate;
        let mag: number = this.magnitude;

        return new Quaternion(
            conj.x / mag,
            conj.y / mag,
            conj.z / mag,
            conj.w / mag
        );
    }

    /**
     * Euler angles representation of this Quaternion.
     */
    public get eulerAngles(): Vector3 {
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

        return new Vector3(x, y, z);
    }

    /**
     * Create a Quaternion from Euler angles.
     * @param v Euler angles Vector3.
     * @returns The Quaternion created from Euler angles.
     */
    public static Euler(v: Vector3): Quaternion {
        return new Quaternion(
            Math.sin(v.z / 2) * Math.cos(v.y / 2) * Math.cos(v.x / 2) - Math.cos(v.z / 2) * Math.sin(v.y / 2) * Math.sin(v.x / 2),
            Math.cos(v.z / 2) * Math.sin(v.y / 2) * Math.cos(v.x / 2) + Math.sin(v.z / 2) * Math.cos(v.y / 2) * Math.sin(v.x / 2),
            Math.cos(v.z / 2) * Math.cos(v.y / 2) * Math.sin(v.x / 2) - Math.sin(v.z / 2) * Math.sin(v.y / 2) * Math.cos(v.x / 2),
            Math.cos(v.z / 2) * Math.cos(v.y / 2) * Math.cos(v.x / 2) + Math.sin(v.z / 2) * Math.sin(v.y / 2) * Math.sin(v.x / 2)
        );
    }

    /**
     * Normalizes a Quaternion.
     * @param q Quaternion to normalize.
     * @returns The normalized Quaternion.
     */
    public static Normalize(q: Quaternion): Quaternion {
        return q.normalized;
    }

    /**
     * Returns the angle in degrees from one Quaternion to another.
     * @param from Start rotation.
     * @param to End rotation.
     * @returns The angle in degrees.
     */
    public static Angle(from: Quaternion, to: Quaternion): number {
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
    public static ClampMagnitude(quaternion: Quaternion, maxLength: number): Quaternion {
        const mag: number = quaternion.magnitude;
        let multiplier: number = 1;

        if (mag > maxLength) {
            multiplier = maxLength / mag;
        }

        return new Quaternion(
            quaternion.x * multiplier,
            quaternion.y * multiplier,
            quaternion.z * multiplier,
            quaternion.w * multiplier
        );
    }

    /**
     * Rotates a Quaternion towards another with a max degree of maxDegreesDelta.
     * @param from Start value.
     * @param to End value.
     * @param maxDegreesDelta The maximum degrees that the rotation have.
     * @returns The rotated Quaternion.
     */
    public static RotateTowards(from: Quaternion, to: Quaternion, maxDegreesDelta: number): Quaternion {
        let angle: number = this.Angle(from, to);
        if (angle === 0) return to;
        return this.SlerpUnclamped(from, to, Math.min(1, maxDegreesDelta / angle));
    }

    /**
     * Spherical Linear Interpolation between two Quaternions. If t is lower than 0, return a. If t is greater than 1, return b.
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Interpolated value, equals to (b * one.inverse)**t * one.
     */
    public static Slerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
        if (t < 0) return a;
        if (t > 1) return b;

        return Quaternion.DoSlerp(a, b, t);
    }

    /**
     * Spherical Linear Interpolation between two Quaternions.
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Interpolated value, equals to a + (b - a) * t.
     */
    private static DoSlerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
        let q1: Quaternion = Quaternion.Multiply(b, a.inverse);
        let q2: Quaternion = Quaternion.identity;

        for (let i = 0; i < t; i += Number.MIN_VALUE) {
            q2 = Quaternion.Multiply(q1, q1);
        }

        return Quaternion.Multiply(q2, a);
    }

    /**
     * Spherical Linear Interpolation between two Quaternions.
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Interpolated value, equals to a + (b - a) * t.
     */
    public static SlerpUnclamped(a: Quaternion, b: Quaternion, t: number): Quaternion {
        return Quaternion.DoSlerp(a, b, t);
    }

    /**
     * Rotates a point with a given rotation.
     * @param rotation The rotation to rotate the point with.
     * @param point The point to rotate with the rotation.
     * @returns The rotated point.
     */
    public static RotatePoint(rotation: Quaternion, point: Vector3): Vector3 {
        let x: number = rotation.x * 2;
        let y: number = rotation.y * 2;
        let z: number = rotation.z * 2;
        let xx: number = rotation.x * x;
        let yy: number = rotation.y * y;
        let zz: number = rotation.z * z;
        let xy: number = rotation.x * y;
        let xz: number = rotation.x * z;
        let yz: number = rotation.y * z;
        let wx: number = rotation.w * x;
        let wy: number = rotation.w * y;
        let wz: number = rotation.w * z;

        let res: Vector3 = new Vector3(
            (1 - (yy + zz)) * point.x + (xy - wz) * point.y + (xz + wy) * point.z,
            (xy + wz) * point.x + (1 - (xx + zz)) * point.y + (yz - wx) * point.z,
            (xz - wy) * point.x + (yz + wx) * point.y + (1 - (xx + yy)) * point.z
        );

        return res;
    }

    /**
     * The dot product between two Quaternions.
     * @param a First Quaternion.
     * @param b Second Quaternion.
     * @returns The result of the dot product between two Quaternions.
     */
    public static Dot(lhs: Quaternion, rhs: Quaternion): number {
        return lhs.x * rhs.x + lhs.y * rhs.y + lhs.z * rhs.z + lhs.w * rhs.w;
    }

    /**
     * Returns the length of a given Quaternion
     * @param quaternion The Quaternion to calculate its magnitude
     * @returns The magnitude of the given Quaternion.
     */
    public static Magnitude(quaternion: Quaternion): number {
        return quaternion.magnitude;
    }

    /**
     * Combines rotations lhs and rhs.
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns The combined Quaternion between lhs and rhs.
     */
    public static Multiply(lhs: Quaternion, rhs: Quaternion): Quaternion {
        return new Quaternion(
            lhs.w * rhs.x + lhs.x * rhs.w + lhs.y * rhs.z - lhs.z * rhs.y,
            lhs.w * rhs.y + lhs.y * rhs.w + lhs.z * rhs.x - lhs.x * rhs.z,
            lhs.w * rhs.z + lhs.z * rhs.w + lhs.x * rhs.y - lhs.y * rhs.x,
            lhs.w * rhs.w - lhs.x * rhs.x - lhs.y * rhs.y - lhs.z * rhs.z
        );
    }

    /**
     * Checks whether the lhs and the rhs Quaternions are the same.
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns Whether or not the two Quaternions are the same.
     */
    public static Equals(lhs: Quaternion, rhs: Quaternion): boolean {
        return (
            lhs.x === rhs.x &&
            lhs.y === rhs.y &&
            lhs.z === rhs.z &&
            lhs.w === rhs.w
        );
    }

    /**
     * Combines rotations between this Quaternion and another.
     * @param other Quaternion to combine with this Quaternion.
     */
    public Multiply(other: Quaternion): void {
        this.x = this.w * other.x + this.x * other.w + this.y * other.z - this.z * other.y;
        this.y = this.w * other.y + this.y * other.w + this.z * other.x - this.x * other.z;
        this.z = this.w * other.z + this.z * other.w + this.x * other.y - this.y * other.x;
        this.w = this.w * other.w - this.x * other.x - this.y * other.y - this.z * other.z;
    }

    /**
     * Checks whether this Quaternion and another are the same.
     * @param other Other Quaternion to check if it's the same with this Quaternion.
     * @returns Whether or not the two Quaternions are the same.
     */
    public Equals(other: Quaternion): boolean {
        return (
            this.x === other.x &&
            this.y === other.y &&
            this.z === other.z &&
            this.w === other.w
        );
    }
}