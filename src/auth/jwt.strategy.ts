import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt"
import { DatabaseService } from "src/database/database.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly databaseService: DatabaseService
    ){
        super ({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "Secret"
        })
    }

    async validate(payload: { email: string }){
        if (!payload.email) {
            throw new Error('Invalid token payload: userEmail is missing');
        }

        const user = await this.databaseService.user.findUnique({
            where: {
                email: payload.email,
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user
    }
}