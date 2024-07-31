export class UserController {
  /**
   * @openapi
   * /user/register:
   *   post:
   *     tags:
   *       - user
   *     summary: Register new user account
   *     description: Register new user account
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequestBodyDto'
   *     responses:
   *       201:
   *         description: Register new user account successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RegisterSuccessResponseDto'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Register_INVALID_PASSWORD_ERROR'
   *       500:
   *         description: Internal server error
   */
  async registerUser(req: any, res: any, next: any) {}
}
