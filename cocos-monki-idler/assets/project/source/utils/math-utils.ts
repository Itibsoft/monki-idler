export function MATH_CLAMP(target: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, target));
}