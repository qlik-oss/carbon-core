import {Element} from '../Element';

describe('Element', () => {
  const mockedCanvas = {
    getSize: jest.fn(),
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('creates', () => {
    mockedCanvas.getSize.mockReturnValue({y: 0, height: 3, x: 0, width: 3});
    const element = new Element(mockedCanvas);
    const boundingRect = element.getBoundingClientRect();
    expect(boundingRect.bottom).toEqual(3);
    expect(boundingRect.right).toEqual(3);

    expect(mockedCanvas.getSize).toBeCalled();
  });
});
