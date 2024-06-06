
# TypeScript Quaternion Math

Fast and easy-to-use Quaternion Math library powered by TypeScript


![Logo](https://socialify.git.ci/gonzaloivan121/quaternion-math/image?description=1&descriptionEditable=Fast%20and%20easy-to-use%20Quaternion%20Math%20library%20powered%20by%20TypeScript&font=Source%20Code%20Pro&forks=1&issues=1&language=1&name=1&owner=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Auto)


## Installation

Install @xloxlolex/quaternion-math with npm

```bash
  mkdir my-project
  cd my-project
  npm install @xloxlolex/quaternion-math
```
    ## Usage

### Import

```typescript
import { Quaternion } from '@xloxlolex/quaternion-math';
```

### Constructor

```typescript
// Creates a new Quaternion with given x, y, z and w components.
// All components are optional and, if not specified, will be set to Quaternion.identity by default.
Quaternion(x?: number, y?: number, z?: number, w?: number);
```

### Static Variables

```typescript
Quaternion.identity; // Quaternion(0, 0, 0, 1).
```

### Static Methods

```typescript
// Create a Quaternion from Euler angles.
Quaternion.Euler(v: Vector3): Quaternion;

// Normalizes a Quaternion.
Quaternion.Normalize(q: Quaternion): Quaternion;

// Returns the angle in degrees from one Quaternion to another.
Quaternion.Angle(from: Quaternion, to: Quaternion): number;

// Returns a copy of a Quaternion with its magnitude clamped to maxLength.
Quaternion.ClampMagnitude(quaternion: Quaternion, maxLength: number): Quaternion;

// Rotates a Quaternion towards another with a max degree of maxDegreesDelta.
Quaternion.RotateTowards(from: Quaternion, to: Quaternion, maxDegreesDelta: number): Quaternion;

// Spherical Linear Interpolation between two Quaternions. If t is lower than 0, return a. If t is greater than 1, return b.
Quaternion.Slerp(a: Quaternion, b: Quaternion, t: number): Quaternion;

// Spherical Linear Interpolation between two Quaternions.
Quaternion.SlerpUnclamped(a: Quaternion, b: Quaternion, t: number): Quaternion;

// Rotates a point with a given rotation.
Quaternion.RotatePoint(rotation: Quaternion, point: Vector3): Vector3;

// The dot product between two Quaternions.
Quaternion.Dot(lhs: Quaternion, rhs: Quaternion): number;

// Returns the length of a given Quaternion
Quaternion.Magnitude(quaternion: Quaternion): number;

// Combines rotations lhs and rhs.
Quaternion.Multiply(lhs: Quaternion, rhs: Quaternion): Quaternion;

// Checks whether the lhs and the rhs Quaternions are the same.
Quaternion.Equals(lhs: Quaternion, rhs: Quaternion): Quaternion;
```

### Public Variables

```typescript
var quaternion = new Quaternion();

quaternion.x; // X component of the Quaternion.
quaternion.y; // Y component of the Quaternion.
quaternion.z; // Z component of the Quaternion.
quaternion.w; // W component of the Quaternion.

quaternion.normalized; // Returns this Quaternion with a magnitude of 1 (Read Only).
quaternion.magnitude; // Returns the length of this Quaternion.
quaternion.sqrMagnitude; // Returns the squared length of this Quaternion.
quaternion.conjugate; // Returns the conjugate of this Quaternion.
quaternion.inverse; // Returns the inverse of this Quaternion.
quaternion.eulerAngles; // Returns the Euler angles representation of this Quaternion.
```

### Public Methods

```typescript
var quaternion = new Quaternion();

// Combines rotations between this Quaternion and another.
quaternion.Multiply(other: Quaternion): void;

// Checks whether this Quaternion and another are the same.
quaternion.Equals(other: Quaternion): boolean;
```
## Dependencies

- [@xloxlolex/vector-math](https://www.npmjs.com/package/@xloxlolex/vector-math)
## Authors

- [@gonzaloivan121 (xloxlolex)](https://www.github.com/gonzaloivan121)


## License

[MIT](https://choosealicense.com/licenses/mit/)


## Support

For support, email chaparro.gonzaloivan@gmail.com.

