import {useContext} from "react";
import {SpotifyAuthContext, SpotifyAuthContextValue} from "@/features/authentication/providers/SpotifyAuthProvider";

export const useSpotifyAuth = (): SpotifyAuthContextValue => {
    const context = useContext(SpotifyAuthContext);
    if (!context) {
        throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
    }
    return context;
};