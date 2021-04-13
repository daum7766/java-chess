package chess.controller.command;

import chess.domain.board.Board;
import chess.view.OutputView;

public final class Ready extends AbstractCommand {

    private static final String POSSIBLE_COMMANDS = "start, exit";

    public Ready(final Board board) {
        super(board);
        OutputView.printStart();
    }

    @Override
    public Command execute(final String command) {
        if (START_COMMAND.equals(command)) {
            return new Play(board);
        }
        if (EXIT_COMMAND.equals(command)) {
            return new Exit(board);
        }
        printErrorMessage(POSSIBLE_COMMANDS);
        return this;
    }
}
