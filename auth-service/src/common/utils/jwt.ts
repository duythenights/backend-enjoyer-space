import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";
import { SessionDocument } from "../../database/models/session.model";
import { UserDocument } from "../../database/models/user.model";
import { config } from "../../config/app.config";

export type AccessTPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};

export type RefreshTPayload = {
  sessionId: SessionDocument["_id"];
};

type SignOptsAndSecret = SignOptions & {
  secret: string;
};

/** ------------------------------
 *  SIGN DEFAULTS (sign() cho phép array)
 * ------------------------------ */
const signDefaults: SignOptions = {
  audience: ["user"],
};

/** ------------------------------
 *  VERIFY DEFAULTS (verify() KHÔNG cho array → phải dùng string)
 * ------------------------------ */
const verifyDefaults: VerifyOptions = {
  audience: "user",
};

/** ------------------------------
 *  ACCESS TOKEN OPTIONS
 * ------------------------------ */
export const accessTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.EXPIRES_IN as SignOptions["expiresIn"],
  secret: config.JWT.SECRET,
};

/** ------------------------------
 *  REFRESH TOKEN OPTIONS
 * ------------------------------ */
export const refreshTokenSignOptions: SignOptsAndSecret = {
  expiresIn: config.JWT.REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  secret: config.JWT.REFRESH_SECRET,
};

/** ------------------------------
 *  SIGN TOKEN (không lỗi TS)
 * ------------------------------ */
export const signJwtToken = (
  payload: AccessTPayload | RefreshTPayload,
  options?: SignOptsAndSecret
) => {
  const { secret, ...opts } = options || accessTokenSignOptions;

  return jwt.sign(payload, secret, {
    ...signDefaults,
    ...opts,
  });
};

/** ------------------------------
 *  VERIFY TOKEN (đã sửa lỗi audience & payload)
 * ------------------------------ */
export const verifyJwtToken = <TPayload extends object = AccessTPayload>(
  token: string,
  options?: VerifyOptions & { secret: string }
) => {
  try {
    const { secret = config.JWT.SECRET, ...opts } = options || {};

    const payload = jwt.verify(token, secret, {
      ...verifyDefaults,
      ...opts,
    }) as unknown as TPayload;

    return { payload };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};
