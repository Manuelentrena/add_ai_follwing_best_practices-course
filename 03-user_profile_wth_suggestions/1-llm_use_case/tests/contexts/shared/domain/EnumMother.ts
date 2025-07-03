export class EnumMother {
	static randomFrom<T>(anEnum: T): T[keyof T] {
		// @ts-ignore
		const enumValues = Object.keys(anEnum).filter((key) =>
			isNaN(Number(key)),
		) as unknown as T[keyof T][];
		const randomIndex = Math.floor(Math.random() * enumValues.length);

		return anEnum[enumValues[randomIndex] as keyof typeof anEnum];
	}
}
