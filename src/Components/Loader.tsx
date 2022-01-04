import styled from 'styled-components';

const Wrapper = styled.div`
height: 20vh;
  display: flex;
  justify-content: center;

  img {
    width: 200px;
  }
`;

export const Loader = () => {
  return (
    <Wrapper>
      <img src="/loading.gif" alt="loading..." />
    </Wrapper>
  );
};
