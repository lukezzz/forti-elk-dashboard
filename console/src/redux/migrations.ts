export const migrations = {
    0.1: (state: any) => {
        // migration to keep only device state
        console.log('Migration Running!')
        return {
            ...state,
            config: {
                remember: true,
                theme: "dark"
            },
            user: {
                isSessionTimeout: true,
                isAuthenticating: false,
                access_token: "",
                refresh_token: "",
                data: undefined
            }
        }
    },

}
