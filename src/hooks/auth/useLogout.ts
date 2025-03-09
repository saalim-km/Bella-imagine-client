import { MutationFunction, useMutation } from "@tanstack/react-query"

export const useLogoutMutation = <T>(mutationFunc : MutationFunction<T>)=> {
    return useMutation<T,unknown,void>({
        mutationFn : mutationFunc
    })
}