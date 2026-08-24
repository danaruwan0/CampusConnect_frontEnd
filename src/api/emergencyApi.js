import api from "./axios";

/**
 * Create Emergency Alert
 */
export const createEmergency = async (
    userId,
    emergency,
    image,
    video
) => {

    const formData = new FormData();

    // JSON Data
    formData.append(
        "data",
        new Blob(
            [
                JSON.stringify(emergency)
            ],
            {
                type: "application/json"
            }
        )
    );

    // Image
    if (image) {

        formData.append(
            "image",
            image
        );

    }

    // Video
    if (video) {

        formData.append(
            "video",
            video
        );

    }

    const response = await api.post(

        `/api/emergency/${userId}`,

        formData,

        {

            headers: {

                "Content-Type":
                    "multipart/form-data"

            }

        }

    );

    return response.data;

};


/**
 * Get All Emergency Alerts
 */
export const getAllEmergencies = async () => {

    const response =
        await api.get("/api/emergency");

    return response.data;

};


/**
 * Get Emergency Alert By Id
 */
export const getEmergency = async (id) => {

    const response =
        await api.get(
            `/api/emergency/${id}`
        );

    return response.data;

};