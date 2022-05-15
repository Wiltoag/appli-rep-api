export abstract class Errors {
    static invalidCredentials = {
        error: "Invalid credentials",
        code: 1
    };
    static invalidToken = {
        error: "Invalid token",
        code: 2
    };
    static userAlreadyExists = {
        error: "User id already exists",
        code: 3
    };
    static ownerAlreadyExists = {
        error: "Owner id already exists",
        code: 3
    };
    static invalidJson = {
        error: "Invalid JSON format",
        code: 4
    };
    static campingIdDoesNotExist = {
        error: "The camping with this id does not exist",
        code: 5
    };
}