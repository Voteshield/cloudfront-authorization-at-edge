
// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { decode, verify } from 'jsonwebtoken';
import jwksClient, { SigningKey, RsaSigningKey } from 'jwks-rsa';

// jwks client is cached at this scope so it can be reused across Lambda invocations
let jwksRsa: jwksClient.JwksClient;

function isRsaSigningKey(key: SigningKey): key is RsaSigningKey {
    return !!(key as any).rsaPublicKey;
}

async function getSigningKey(jwksUri: string, kid: string) {
    // Retrieves the public key that corresponds to the private key with which the token was signed

    if (!jwksRsa) {
        jwksRsa = jwksClient({ cache: true, rateLimit: true, jwksUri });
    }
    return new Promise<string>((resolve, reject) =>
        jwksRsa.getSigningKey(
            kid,
            (err, jwk) => err ? reject(err) : resolve(isRsaSigningKey(jwk) ? jwk.rsaPublicKey : jwk.publicKey))
    );
}

export async function validate(jwtToken: string, jwksUri: string, issuer: string, audience: string, targetState: string) {

    const decodedToken = decode(jwtToken, { complete: true }) as { [key: string]: any };
    if (!decodedToken) {
        throw new Error('Cannot parse JWT token');
    }

    // make sure the user's in the right group
    var cognitoGroups = decodedToken['payload']["cognito:groups"];
    cognitoGroups = cognitoGroups.toLocaleString().toLowerCase().split(',');
    if (cognitoGroups.indexOf("developers") >= 0) {
        // There's probably a better way to do this
    } else 
    if (cognitoGroups.indexOf(targetState) == -1) {
    	throw new Error('You dont have the correct group ' + targetState + ' to view this page. Found groups: ' + cognitoGroups);
    };

    // The JWT contains a "kid" claim, key id, that tells which key was used to sign the token
    const kid = decodedToken['header']['kid'];
    const jwk = await getSigningKey(jwksUri, kid);

    // Verify the JWT
    // This either rejects (JWT not valid), or resolves (JWT valid)
    const verificationOptions = {
        audience,
        issuer,
        ignoreExpiration: false,
    };
    return new Promise((resolve, reject) => verify(
        jwtToken,
        jwk,
        verificationOptions,
        (err) => err ? reject(err) : resolve()));
}

