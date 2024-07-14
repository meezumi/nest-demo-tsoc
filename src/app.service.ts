import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello! Todo Rest API this side :)';
    }
}