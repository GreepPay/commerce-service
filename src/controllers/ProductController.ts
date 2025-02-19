import type { ICreateProduct } from "../forms/products";
import { ProductService } from "../services/ProductService";
import { User } from "../models/User";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";

export class ProductController {
  // Get authenticated user
  async getAllProducts(request: BunRequest) {
    let response = await new ProductService(request).allProducts();

    if (response) {
      return HttpResponse.success("Products fetched successfully", response);
    }
    return response;
  }

  // Create a new product
  //   async createAuthUser(request: BunRequest) {
  //     let data: ICreateProduct = (await request.json()) as ICreateProduct;
  //     let response = await new ProductService(request).saveUser(data);

  //     if (response instanceof User) {
  //       return HttpResponse.success("User created successfully", response);
  //     }

  //     return response;
  //   }

  //   // Authenticate user
  //   async login(request: BunRequest) {
  //     let data: AuthenticateUserForm =
  //       (await request.json()) as AuthenticateUserForm;
  //     let response = await new AuthenticationService(request).authenticateUser(
  //       data
  //     );

  //     if ("token" in response) {
  //       return HttpResponse.success("User authenticated successfully", response);
  //     }

  //     return response;
  //   }

  //   // Reset user OTP
  //   async resetUserOtp(request: BunRequest) {
  //     let data: ResetPasswordForm = (await request.json()) as ResetPasswordForm;
  //     let response = await new AuthenticationService(request).resetUserOtp(
  //       data.email
  //     );

  //     if (response instanceof User) {
  //       return HttpResponse.success("User OTP reset successfully", response);
  //     }

  //     return response;
  //   }

  //   // Verify user OTP
  //   async verifyUserOtp(request: BunRequest) {
  //     let data: ValidateOtpForm = (await request.json()) as ValidateOtpForm;
  //     let response = await new AuthenticationService(request).verifyUserOtp(data);

  //     if (response instanceof User) {
  //       return HttpResponse.success("User OTP verified successfully", response);
  //     }

  //     return response;
  //   }

  //   // Update user password
  //   async updateUserPassword(request: BunRequest) {
  //     let data: ResetPasswordForm = (await request.json()) as ResetPasswordForm;
  //     let response = await new AuthenticationService(request).updateUserPassword(
  //       data
  //     );

  //     return response;
  //   }

  // Update user profile
  //   async updateUserProfile(request: BunRequest) {
  //     let data: UpdateUserProfileForm =
  //       (await request.json()) as UpdateUserProfileForm;
  //     let response = await new AuthenticationService(request).updateUserProfile(
  //       data
  //     );

  //     if (response instanceof User) {
  //       return HttpResponse.success(
  //         "User profile updated successfully",
  //         response
  //       );
  //     }

  //     return response;
  //   }

  //   // Logout user
  //   async logout(request: BunRequest) {
  //     let response = await new AuthenticationService(request).logoutUser();
  //     return response;
  //   }

  //   // Delete user
  //   async deleteUser(request: BunRequest) {
  //     let userId = request.params.id;
  //     let response = await new AuthenticationService(request).deleteUser(userId);
  //     return response;
  //   }
}
