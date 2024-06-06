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
     * Returns this Quaternion with a magnitude of 1.
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
        return new Quaternion(-this.x, -this.y, -this.z, this.w);
    }

    /**
     * Returns the inverse of this Quaternion.
     */
    public get inverse(): Quaternion {
        let conj: Quaternion = this.conjugate;
        let mag2: number = this.magnitude ** 2;

        return new Quaternion(
            conj.x / mag2,
            conj.y / mag2,
            conj.z / mag2,
            conj.w / mag2
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
     * @returns Spherical Linear Interpolated value between two Quaternions by t.
     */
    public static Slerp(from: Quaternion, to: Quaternion, t: number): Quaternion {
        if (t < 0) return from;
        if (t > 1) return to;

        return Quaternion.DoSlerp(from, to, t);
    }

    /**
     * Spherical Linear Interpolation between two Quaternions.
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Spherical Linear Interpolated value between two Quaternions by t.
     */
    private static DoSlerp(from: Quaternion, to: Quaternion, t: number): Quaternion {
        // Compute the dot product (cosine of the angle)
        let dot: number = this.Dot(from, to);

        // If the dot product is negative, slerp won't take the shorter path
        // So we invert one quaternion to take the shorter path
        if (dot < 0) {
            to = new Quaternion(-to.x, -to.y, -to.z, -to.w);
            dot = -dot;
        }

        const DOT_THRESHOLD: number = 0.9995;
        if (dot > DOT_THRESHOLD) {
            // If the quaternions are very close, we use linear interpolation
            const result: Quaternion = new Quaternion(
                from.x + t * (to.x - from.x),
                from.y + t * (to.y - from.y),
                from.z + t * (to.z - from.z),
                from.w + t * (to.w - from.w)
            );

            return result.normalized;
        }

        // Calculate the angle between the quaternions
        const theta_0: number = Math.acos(dot);
        const theta: number = theta_0 * t;

        // Compute the second quaternion orthogonal to the Quaternion "to"
        const to_orthogonal: Quaternion = new Quaternion(
            to.x - from.x * dot,
            to.y - from.y * dot,
            to.z - from.z * dot,
            to.w - from.w * dot
        ).normalized;

        // Calculate the interpolated quaternion
        return new Quaternion(
            from.x * Math.cos(theta) + to_orthogonal.x * Math.sin(theta),
            from.y * Math.cos(theta) + to_orthogonal.y * Math.sin(theta),
            from.z * Math.cos(theta) + to_orthogonal.z * Math.sin(theta),
            from.w * Math.cos(theta) + to_orthogonal.w * Math.sin(theta)
        );
    }

    /**
     * Spherical Linear Interpolation between two Quaternions.
     * @param a Start value, returned when t = 0.
     * @param b End value, returned when t = 1.
     * @param t Value used to interpolate between a and b.
     * @returns Spherical Linear Interpolated value between two Quaternions by t.
     */
    public static SlerpUnclamped(from: Quaternion, to: Quaternion, t: number): Quaternion {
        return Quaternion.DoSlerp(from, to, t);
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
     * Returns the length of a given Quaternion.
     * @param quaternion The Quaternion to calculate its magnitude.
     * @returns The magnitude of the given Quaternion.
     */
    public static Magnitude(quaternion: Quaternion): number {
        return quaternion.magnitude;
    }

    /**
     * Add two Quaternions.
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns The result of the addition between the two Quaternions.
     */
    public static Add(lhs: Quaternion, rhs: Quaternion): Quaternion {
        return new Quaternion(
            lhs.x + rhs.x,
            lhs.y + rhs.y,
            lhs.z + rhs.z,
            lhs.w + rhs.w
        );
    }

    /**
     * Subtract two Quaternions.
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns The result of the subtraction between the two Quaternions.
     */
    public static Subtract(lhs: Quaternion, rhs: Quaternion): Quaternion {
        return new Quaternion(
            lhs.x - rhs.x,
            lhs.y - rhs.y,
            lhs.z - rhs.z,
            lhs.w - rhs.w
        );
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
     * Divides two Quaternions (lhs / rhs).
     * @param lhs First Quaternion.
     * @param rhs Second Quaternion.
     * @returns The quotient of the division between the two Quaternions.
     */
    public static Divide(lhs: Quaternion, rhs: Quaternion): Quaternion {
        const inverseRhs = rhs.inverse;
        return Quaternion.Multiply(lhs, inverseRhs);
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
     * Add a Quaternion to this Quaternion.
     * @param other The Quaternion to add to this Quaternion.
     */
    public Add(other: Quaternion): void {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        this.w += other.w;
    }

    /**
     * Subtract a Quaternion from this Quaternion.
     * @param other The Quaternion to subtract from this Quaternion.
     */
    public Subtract(other: Quaternion): void {
        this.x -= other.x;
        this.y -= other.y;
        this.z -= other.z;
        this.w -= other.w;
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
     * Divides two Quaternions (this / other).
     * @param other Second Quaternion.
     */
    public Divide(other: Quaternion): void {
        const inverseOther = other.inverse;
        this.Multiply(inverseOther);
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