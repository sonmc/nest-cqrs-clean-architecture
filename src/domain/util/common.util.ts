export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const convertToBase64 = async (data: string) => {
  try {
    if (data) {
      const response = await fetch(data);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        return base64;
      }
    }
  } catch (error: any) {
    console.error('Error converting to Base64:', error.message);
    return null;
  }
};

export const filterUniqueTypes = (links: any) => {
  const uniqueTypes: any = {};

  const filteredLinks = links.filter((link: any) => {
    if (!uniqueTypes[link.type]) {
      uniqueTypes[link.type] = true;
      return true;
    }
    return false;
  });

  return filteredLinks;
};
