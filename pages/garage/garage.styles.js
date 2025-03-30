import styled from 'styled-components';

export const Mosaic = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
    padding: 20px;

    @media (min-width: 1024px) {
        grid-template-columns: repeat(5, 1fr);
    }
`;

export const ImageGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-top: 15px;
    margin-bottom: 15px;
`;

export const ImagePreview = styled.div`
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid orange;
    height: 150px;
`;

export const RemoveImageButton = styled.button`
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(255, 0, 0, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    z-index: 5;

    &:hover {
        background-color: red;
    }
`;

export const ImageUploadButton = styled.button`
    border: 2px dashed #dddddd;
    border-radius: 5px;
    height: 150px;
    width: 100%;
    margin-bottom: 2%;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &:hover {
        border-color: orange;
        background-color: rgba(255, 165, 0, 0.05);
    }
`;

export const ImageGallery = styled.div`
    display: flex;
    overflow-x: auto;
    gap: 8px;
    margin-top: 10px;
    padding-bottom: 5px;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
        background: orange;
        border-radius: 10px;
    }
`;

export const ThumbnailImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 5px;
    cursor: pointer;
    border: 2px solid transparent;

    &.active {
        border-color: orange;
    }
`;

export const NavigationButtonContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
`;

export const DeleteButton = styled.button`
    top: 10px;
    right: 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 5px;
    visibility: hidden;
    transition: opacity 1s ease, visibility 0.3s ease;
    width: 100%;
    height: 30px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;

    &:hover {
        background-color: darkred;
    }
`;

export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const ModalContent = styled.div`
    background: white;
    border-radius: 10px;
    padding: 20px;
    min-width: 650px;
    min-height: 650px;
    max-width: 650px;
    max-height: 80vh;
    overflow-y: auto;
    border: 1px solid #ccc;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const Card = styled.div`
    background: white;
    border-radius: 10px;
    border: 1px solid #f0f0f0;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    width: 300px;
    flex-direction: column;
    transition: transform 0.2s, box-shadow 0.2s;
    cursor: pointer;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    }

    &:hover ${DeleteButton} {
        opacity: 1;
        visibility: visible;
    }
`;

export const Image = styled.img`
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-bottom: 3px solid orange;
`;

export const CardContent = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const Subtitle = styled.h3`
    font-size: 1em;
    font-weight: bold;
    margin: 0;
    color: #333;
`;

export const Detail = styled.p`
    font-size: 0.9em;
    margin: 0;
    color: #666;
`;

export const FormContainer = styled.div`
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    height: 600px;
    overflow-y: auto;
`;

export const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const Select = styled.select`
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const Button = styled.button`
    background-color: orange;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;

    &:hover {
        background-color: #e69500;
    }
`;

export const ToggleButton = styled.button`
    background-color: orange;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;
    border: 2px solid orange;

    &:hover {
        background-color: white;
        border: 2px solid orange;
        color: orange;
    }
`;