import { Product } from "../models/Product";
import HttpResponse, { type HttpResponseType } from "../common/HttpResponse";
import { randomBytes } from "crypto";
import type { ICreateProduct } from "../forms/products";

/**
 * Service class handling user-related operations including product creation,
 */
export class ProductService {
  constructor(request: Request) {}
  /**
   * Retrieves all products
   * @returns Promise resolving to User object or HTTP response
   */
  async allProducts(): Promise<Product[] | HttpResponseType> {
    try {
      const products = await Product.find();

      if (!products) {
        return HttpResponse.failure("No products found", 404);
      }

      return products;
    } catch (error) {
      console.log({ error });

      return HttpResponse.failure("failed to get product", 401);
    }
  }

  //   /**
  //    * Creates a new user or updates existing user based on provided data
  //    * @param data - User creation form data
  //    * @returns Promise resolving to User object or HTTP response
  //    */
  //   async saveUser(data: ICreateProduct): Promise<Product | HttpResponseType> {
  //     // Step 1: Check for existing user and valid role
  //     const existingUser = await User.findOne({ where: { email: data.email } });
  //     const role = await Role.findOne({ where: { name: data.role } });
  //     if (!role) {
  //       return HttpResponse.failure("User role must be specified", 400);
  //     }

  //     // Step 2: Handle phone number verification
  //     if (data.phoneNumber) {
  //       const userByPhone = await User.findOne({
  //         where: { phone: data.phoneNumber },
  //       });
  //       if (userByPhone) {
  //         if (userByPhone.phone_verified_at) {
  //           return HttpResponse.failure("User with phone number exists", 400);
  //         } else {
  //           return await this.resetUserOtp(userByPhone.uuid);
  //         }
  //       }
  //     }

  //     // Step 3: Create new user if doesn't exist
  //     if (!existingUser) {
  //       // Initialize new user object with provided data
  //       const newUser = new User();
  //       newUser.first_name = data.firstName;
  //       newUser.last_name = data.lastName;
  //       newUser.email = data.email;
  //       newUser.phone = data.phoneNumber;
  //       newUser.password = data.password ? await hash(data.password, 10) : "";
  //       newUser.otp = data.otp;
  //       newUser.otp_expired_at = new Date(Date.now() + 43200 * 60 * 1000); // 30 days
  //       newUser.role_id = role.id.toString();
  //       newUser.sso_id = data.ssoId;

  //       const user = await User.create(newUser);

  //       // Handle SSO verification
  //       if (data.isSso) {
  //         user.email_verified_at = new Date();
  //         await user.save();
  //       }

  //       return user;
  //     } else {
  //       // Step 4: Handle existing user scenarios
  //       if (data.ignoreError) {
  //         // Update existing user if ignoreError flag is true
  //         existingUser.first_name = data.firstName || existingUser.first_name;
  //         existingUser.last_name = data.lastName || existingUser.last_name;
  //         existingUser.otp = data.otp;
  //         await existingUser.save();
  //         return existingUser;
  //       }

  //       if (existingUser.email_verified_at && existingUser.password) {
  //         return HttpResponse.failure("User with email already exists", 400);
  //       }

  //       return existingUser;
  //     }
  //   }

  //   /**
  //    * Authenticates user with email and password
  //    * @param username - User's email or phone number
  //    * @param password - User's password
  //    * @returns Promise resolving to token and user object or HTTP response
  //    */
  //   async authenticateUser(
  //     data: AuthenticateUserForm
  //   ): Promise<AuthenticateUserResponse | HttpResponseType> {
  //     // Step 1: Find user by email or phone
  //     let user: User | null = null;

  //     if (this.isNumeric(data.username)) {
  //       user = await User.findOne({ where: { phone: data.username } });
  //     } else {
  //       user = await User.findOne({ where: { email: data.username } });
  //     }

  //     if (!user) {
  //       return HttpResponse.failure(
  //         "User with email does not exist, please Sign Up.",
  //         401
  //       );
  //     }

  //     // Step 2: Validate credentials
  //     if (data.password) {
  //       const isValidPassword = await compare(data.password, user.password);
  //       if (!isValidPassword) {
  //         return HttpResponse.failure(
  //           "Credentials do not match our records!",
  //           401
  //         );
  //       }
  //     } else {
  //       // SSO login validation
  //       if (user.sso_id && user.sso_id !== data.sso_id) {
  //         return HttpResponse.failure(
  //           "Credentials do not match our records!",
  //           401
  //         );
  //       }
  //     }

  //     // Step 3: Generate JWT token
  //     const token = this.jwtService.generateToken(user);

  //     // Step 4: Handle device login limits
  //     if (process.env.APP_STATE && token) {
  //       const maxActiveDevices = 4;
  //       const existingTokens = await AuthToken.find({
  //         where: { auth_id: user.uuid },
  //         order: { created_at: "ASC" },
  //       });

  //       // Remove older tokens if limit exceeded
  //       if (existingTokens.length >= maxActiveDevices) {
  //         // Keep the first token, delete the rest
  //         for (const oldToken of existingTokens.slice(1)) {
  //           await AuthToken.delete(oldToken.id);
  //         }
  //       }

  //       // Create new auth token
  //       await AuthToken.create({
  //         auth_id: user.uuid,
  //         auth_token: token,
  //       });
  //     }

  //     return token
  //       ? { token, user }
  //       : HttpResponse.failure("Credentials do not match our records!", 401);
  //   }

  //   /**
  //    * Resets user OTP and updates expiration time
  //    * @param userUuid - UUID of the user
  //    * @returns Promise resolving to User object or HTTP response
  //    */
  //   async resetUserOtp(userUuid: string): Promise<User | HttpResponseType> {
  //     // Step 1: Find user by UUID
  //     const user = await User.findOne({ where: { uuid: userUuid } });
  //     if (!user) {
  //       return HttpResponse.failure('User not found', 400);
  //     }

  //     // Step 2: Generate and set new OTP
  //     const otp = generateOtp();
  //     user.otp = otp;
  //     user.otp_expired_at = new Date(Date.now() + 43200 * 60 * 1000); // 30 days expiration
  //     await user.save();

  //     return user;
  //   }

  //   /**
  //    * Updates user password after verification
  //    * @param data - Object containing user email and new password
  //    * @returns Promise resolving to success message or HTTP response
  //    */
  //   async updateUserPassword(data: ResetPasswordForm): Promise<HttpResponseType> {
  //     // Step 1: Find and validate user
  //     const user = await User.findOne({ where: { email: data.email } });
  //     if (!user) {
  //       return HttpResponse.failure('User not found', 400);
  //     }

  //     if (!user.email_verified_at) {
  //       return HttpResponse.failure('Email not verified', 400);
  //     }

  //     // Step 2: Hash and update password
  //     user.password = await hash(data.password, 10);
  //     await user.save();

  //     return HttpResponse.success('Password updated successfully', 200);
  //   }

  //   /**
  //    * Verifies user OTP and updates verification status
  //    * @param data - Object containing user identifier and OTP
  //    * @returns Promise resolving to User object or HTTP response
  //    */
  //   async verifyUserOtp(data: ValidateOtpForm): Promise<User | HttpResponseType> {
  //     // Step 1: Find user by UUID or email
  //     let user = await User.findOne({ where: { uuid: data.userUuid } });

  //     if (!user && data.email) {
  //       user = await User.findOne({ where: { email: data.email } });
  //     }

  //     if (!user) {
  //       return HttpResponse.failure('User not found', 400);
  //     }

  //     // Step 2: Validate OTP
  //     if (user.otp_expired_at && user.otp_expired_at < new Date()) {
  //       return HttpResponse.failure('OTP expired', 400);
  //     }

  //     if (user.otp !== data.otp.trim()) {
  //       return HttpResponse.failure('Incorrect OTP! Enter valid otp', 400);
  //     }

  //     // Step 3: Handle phone/email verification
  //     if (data.phone) {
  //       user.phone = data.phone;
  //       user.phone_verified_at = new Date();
  //       await user.save();
  //       return user;
  //     } else {
  //       if (user.email_verified_at) {
  //         return HttpResponse.success('OTP Verified', 200);
  //       }
  //       user.email_verified_at = new Date();
  //       await user.save();
  //     }

  //     return HttpResponse.success('OTP Verified', 200);
  //   }

  //   /**
  //    * Deletes user account
  //    * @param userId - UUID of the user
  //    * @returns Promise resolving to HTTP response
  //    */
  //   async deleteUser(userId: string): Promise<HttpResponseType> {
  //     const user = await User.findOne({ where: { uuid: userId } });

  //     if (!user) {
  //       return HttpResponse.failure('User not found', 400);
  //     }

  //     await User.update(userId, {
  //       first_name: 'Deleted',
  //       last_name: 'Account',
  //       email: '',
  //       phone: '',
  //       status: 'deleted'
  //     });

  //     return HttpResponse.success('User deleted successfully', 200);
  //   }
}
