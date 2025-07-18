import { User, UserPrimitives } from "../../../../../src/contexts/mooc/users/domain/User";
import { UserStatus } from "../../../../../src/contexts/mooc/users/domain/UserStatus";
import { UserEmailMother } from "./UserEmailMother";
import { UserIdMother } from "./UserIdMother";
import { UserNameMother } from "./UserNameMother";
import { UserProfilePictureMother } from "./UserProfilePictureMother";

export class UserMother {
	static create(params?: Partial<UserPrimitives>): User {
		const primitives: UserPrimitives = {
			id: UserIdMother.create().value,
			name: UserNameMother.create().value,
			email: UserEmailMother.create().value,
			profilePicture: UserProfilePictureMother.create().value,
			status: UserStatus.Active,
			finishedCourses: [],
			recommendedCourses: '',
			...params,
		};

		return User.fromPrimitives(primitives);
	}
}
