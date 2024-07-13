import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly dataservice: DatabaseService,
    private readonly jwtservice: JwtService
  ){}

  async login(loginData: LoginDto){

    const { email, password } = loginData;
    const user = await this.dataservice.user.findFirst({
      where: {
        email: email
      }
    })
    if (!user) {
      throw new NotFoundException("The user doesn't exists, check your credentials")
    }
    const validatePassword = await bcrypt.compare(password, user.password)
    if(!validatePassword){
      throw new NotFoundException("Wrong Password")
    }

    return {
      token: this.jwtservice.sign({email})
    }
  }

  async register(registerData: RegisterUserDto) {
    const user = await this.dataservice.user.findFirst({
      where: {
        email: registerData.email
      }
    })
    if(user){
      throw new BadGatewayException('User with this email already exists')
    }

    registerData.password = await bcrypt.hash(registerData.password, 10)
    const res = await this.dataservice.user.create({ data: registerData })

    return res;
  }

  
}
